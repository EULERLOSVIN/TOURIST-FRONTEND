import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReviewService } from '../../services/review.service';
import { CommentFilterRequestDto, CommentModerationDto } from '../../models/review.model';

@Component({
  selector: 'app-reviews.page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.page.html',
  styleUrl: './reviews.page.scss',
})
export class ReviewsPage implements OnInit, OnDestroy {
  // Lista de reseñas procedentes del servidor
  resenas: CommentModerationDto[] = [];
  
  // Estado de carga y procesos
  cargando: boolean = true;
  procesandoId: number | null = null;
  totalItems: number = 0;
  totalPages: number = 1;

  // Filtro activo: 'Pendiente' (1) o 'Aprobado' (2)
  estadoSeleccionado: string = 'Pendiente';

  // Objeto de filtros paginados
  filtros: CommentFilterRequestDto = {
    searchTerm: '',
    state: 'Pendiente',
    pageNumber: 1,
    pageSize: 5
  };

  // 🚨 Estado para el Modal Personalizado de Confirmación
  mostrarModalConfirmacion: boolean = false;
  idResenaAEliminar: number | null = null;

  private readonly buscadorSubject = new Subject<string>();

  constructor(
    private readonly reviewService: ReviewService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarResenas();
    this.inicializarBuscador();
  }

  /**
   * Carga las reseñas paginadas desde la API en .NET Core
   */
  cargarResenas(): void {
    this.cargando = true;
    this.filtros.state = this.estadoSeleccionado;

    this.reviewService.getPagedComments(this.filtros).subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          this.resenas = res.value.items;
          this.totalItems = res.value.totalItems;
          this.totalPages = res.value.totalPages;
        } else {
          this.resenas = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar reseñas para moderación:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Configura el antirrebote para la caja de búsqueda (350ms)
   */
  private inicializarBuscador(): void {
    this.buscadorSubject.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filtros.pageNumber = 1;
      this.cargarResenas();
    });
  }

  onSearchInput(): void {
    this.buscadorSubject.next(this.filtros.searchTerm ?? '');
  }

  /**
   * Cambia la pestaña activa (Pendientes / Aprobadas)
   */
  cambiarEstado(nuevoEstado: string): void {
    if (this.estadoSeleccionado !== nuevoEstado) {
      this.estadoSeleccionado = nuevoEstado;
      this.filtros.pageNumber = 1;
      this.cargarResenas();
    }
  }

  /**
   * Cambia de página en el navegador
   */
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages && nuevaPagina !== this.filtros.pageNumber) {
      this.filtros.pageNumber = nuevaPagina;
      this.cargarResenas();
    }
  }

  /**
   * Acción para Aprobar la reseña (Mueve de Pendiente -> Aprobado)
   */
  aprobarResena(idComment: number): void {
    this.procesandoId = idComment;
    this.reviewService.approveComment(idComment).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Remover en caliente de la vista
          this.resenas = this.resenas.filter(r => r.idComment !== idComment);
          this.totalItems = Math.max(0, this.totalItems - 1);
          
          if (this.resenas.length === 0 && this.filtros.pageNumber > 1) {
            this.filtros.pageNumber--;
            this.cargarResenas();
          }
        } else {
          alert(`No se pudo aprobar: ${res.errorMessage}`);
        }
        this.procesandoId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al aprobar reseña:', err);
        this.procesandoId = null;
        this.cdr.detectChanges();
      }
    });
  }

  // ======================================================
  // 🚨 MANEJO DEL MODAL PERSONALIZADO DE RECHAZO
  // ======================================================

  /**
   * Abre el modal de advertencia personalizado
   */
  rechazarResena(idComment: number): void {
    this.idResenaAEliminar = idComment;
    this.mostrarModalConfirmacion = true;
  }

  /**
   * Cierra el modal sin realizar acciones
   */
  cancelarRechazo(): void {
    this.mostrarModalConfirmacion = false;
    this.idResenaAEliminar = null;
  }

  /**
   * Confirma y ejecuta la eliminación física en SQL Server
   */
  confirmarRechazo(): void {
    if (!this.idResenaAEliminar) return;

    const idComment = this.idResenaAEliminar;
    this.procesandoId = idComment;

    this.reviewService.rejectComment(idComment).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.resenas = this.resenas.filter(r => r.idComment !== idComment);
          this.totalItems = Math.max(0, this.totalItems - 1);

          if (this.resenas.length === 0 && this.filtros.pageNumber > 1) {
            this.filtros.pageNumber--;
            this.cargarResenas();
          }
        } else {
          alert(`No se pudo eliminar: ${res.errorMessage}`);
        }
        this.procesandoId = null;
        this.mostrarModalConfirmacion = false;
        this.idResenaAEliminar = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al rechazar reseña:', err);
        this.procesandoId = null;
        this.mostrarModalConfirmacion = false;
        this.idResenaAEliminar = null;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Genera las iniciales del nombre (Ej: "Alejandro Morales" -> "AM")
   */
  obtenerIniciales(nombre: string): string {
    if (!nombre) return 'TA';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }

  ngOnDestroy(): void {
    this.buscadorSubject.complete();
  }
}