import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; // 👈 Inyectamos ChangeDetectorRef
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms"; 
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; 
import { PlaceService } from '../../services/place.service';
import { DeleteModalComponent } from "../../components/delete-modal/delete-modal.component";
import { PlaceDetailsDto, CategoryLookupDto, PlaceFilterRequestDto } from '../../models/place.model';

@Component({
  selector: 'app-place.page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DeleteModalComponent],
  templateUrl: './place.page.html',
  styleUrl: './place.page.scss',
})
export class PlacePage implements OnInit, OnDestroy { 
  lugares: PlaceDetailsDto[] = [];
  categorias: CategoryLookupDto[] = [];

  estadosTuristicos = [
    { label: 'Abierto al Público', value: 'Abierto al Público' },
    { label: 'Cerrado Temporalmente', value: 'Cerrado Temporalmente' }
  ];

  filtros: PlaceFilterRequestDto = {
    searchTerm: '',
    idCategoryOfPlace: 0,
    destinationState: '',
    pageNumber: 1,
    pageSize: 6 
  };

  totalItems: number = 0;
  totalPages: number = 0;
  
  // Variable de control para el estado visual de carga inicial
  cargando: boolean = true;

  mostrarModalEliminar: boolean = false;
  lugarSeleccionado: PlaceDetailsDto | null = null;

  private readonly buscadorSubject = new Subject<string>();

  // 👈 Agregamos cdr al constructor
  constructor(
    private readonly placeService: PlaceService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.inicializarBuscadorReactivo();
  }

  private inicializarBuscadorReactivo(): void {
    this.buscadorSubject.pipe(
      debounceTime(350),          
      distinctUntilChanged()      
    ).subscribe(() => {
      this.aplicarFiltros(true);
    });
  }

  onSearchInput(): void {
    this.buscadorSubject.next(this.filtros.searchTerm ?? '');
  }

  cargarDatosIniciales(): void {
    this.cargando = true;
    forkJoin({
      categoriasRes: this.placeService.getPlacesCategories(),
      lugaresRes: this.placeService.getPagedPlaces(this.filtros)
    }).subscribe({
      next: (res) => {
        if (res.categoriasRes.isSuccess) {
          this.categorias = res.categoriasRes.value;
        }
        this.procesarRespuestaLugares(res.lugaresRes);
        this.cargando = false;
        this.cdr.detectChanges(); // 🚀 Fuerza el pintado inmediato de los combos y las tarjetas iniciales
      },
      error: (err) => {
        console.error('Error al inicializar la página de atractivos:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(reiniciarPagina: boolean = false): void {
    if (reiniciarPagina) {
      this.filtros.pageNumber = 1;
    }

    this.placeService.getPagedPlaces(this.filtros).subscribe({
      next: (res) => {
        this.procesarRespuestaLugares(res);
        this.cdr.detectChanges(); // 🚀 Fuerza el pintado al filtrar
      },
      error: (err) => console.error('Error al filtrar atractivos turísticos:', err)
    });
  }

  private typeofEstado(estado: string): string {
    return estado === 'Abierto al Público' ? 'publicado' : 'borrador';
  }

  private procesarRespuestaLugares(res: any): void {
    if (res.isSuccess && res.value) {
      this.lugares = res.value.items;
      this.totalItems = res.value.totalItems;
      this.totalPages = res.value.totalPages;
    }
  }

  abrirModalEliminar(lugar: PlaceDetailsDto): void {
    this.lugarSeleccionado = lugar;
    this.mostrarModalEliminar = true;
  }

  ejecutarEliminacion(): void {
    if (this.lugarSeleccionado) {
      this.placeService.deletePlace(this.lugarSeleccionado.idPlace).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.aplicarFiltros(); 
          } else {
            alert(`No se pudo eliminar: ${res.errorMessage}`);
          }
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error físico en la petición de borrado:', err);
          this.cerrarModal();
        }
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModalEliminar = false;
    this.lugarSeleccionado = null;
    this.cdr.detectChanges();
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
      this.filtros.pageNumber = nuevaPagina;
      this.aplicarFiltros();
    }
  }

  ngOnDestroy(): void {
    this.buscadorSubject.complete();
  }
}