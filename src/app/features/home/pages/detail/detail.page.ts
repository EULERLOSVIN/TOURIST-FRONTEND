import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 🔐 Vinculación bidireccional de formularios
import { TouristPlaceService } from '../../services/tourist-place.service';
import { TouristPlaceDetailsDto, AddCommentRequestDto } from '../../models/tourist-place.model';

@Component({
  selector: 'app-detail.page',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './detail.page.html',
  styleUrl: './detail.page.scss',
})
export class DetailPage implements OnInit {
  private location = inject(Location);
  private router = inject(Router);
  private touristPlaceService = inject(TouristPlaceService);
  private cdr = inject(ChangeDetectorRef);

  destinoSeleccionado: TouristPlaceDetailsDto | null = null;

  // 🚀 Estado reactivo ajustado al DTO real de tu API .NET Core
  nuevoComentario: AddCommentRequestDto = {
    idPlace: 0,
    nameUser: '',
    qualification: 5, // Puntuación predeterminada (5 estrellas)
    comment: '' // 👈 Cambiado consistentemente a 'comment'
  };
  
  enviandoComentario: boolean = false;

  constructor() {
    // CAPTURA INMEDIATA: Leemos el estado enviado por [state] en el home
    const navigation = this.router.getCurrentNavigation();
    this.destinoSeleccionado = navigation?.extras.state?.['data'];
  }

  ngOnInit(): void {
    // CAPTURA DE RESPALDO: Por si hay una recarga (F5) en el navegador
    if (!this.destinoSeleccionado) {
      this.destinoSeleccionado = history.state?.['data'];
    }
    
    if (this.destinoSeleccionado) {
      this.nuevoComentario.idPlace = this.destinoSeleccionado.idPlace;
    } else {
      console.warn('No se recibieron datos de navegación. Redireccionando...');
      this.router.navigate(['/']);
    }
  }

  regresar(): void {
    this.location.back();
  }

  irAResenas(elemento: HTMLElement): void {
    elemento.scrollIntoView({ behavior: 'smooth' });
  }

  setCalificacion(estrellas: number): void {
    this.nuevoComentario.qualification = estrellas;
  }

  /**
   * Envía la opinión del turista a la API de SQL Server e inserta el comentario
   */
  enviarOpinion(): void {
    // 🚀 CORREGIDO: Se cambió '.commentText' por '.comment' para evitar valores nulos
    if (!this.nuevoComentario.comment || !this.nuevoComentario.comment.trim()) {
      alert('Por favor, escribe un comentario antes de enviar.');
      return;
    }

    this.enviandoComentario = true;

    this.touristPlaceService.addPlaceComment(this.nuevoComentario).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Inyección inmediata en caliente en la UI para que el usuario vea su comentario al instante
          this.destinoSeleccionado?.comments.unshift({
            idComment: Date.now(), // ID temporal para el tracking del renderizador
            nameUser: this.nuevoComentario.nameUser.trim() || 'Turista Anónimo',
            qualification: this.nuevoComentario.qualification,
            commentText: this.nuevoComentario.comment // 👈 Sincronizado con el texto enviado
          });

          // Limpiar los controles del formulario interactivo
          this.nuevoComentario.nameUser = '';
          this.nuevoComentario.comment = ''; // 👈 Limpieza corregida
          this.nuevoComentario.qualification = 5;
          
          // alert('¡Gracias por tu opinión! Se ha publicado con éxito.');
        } else {
          alert(`Error al registrar opinión: ${res.errorMessage}`);
        }
        this.enviandoComentario = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error crítico al conectar con el servidor .NET:', err);
        this.enviandoComentario = false;
        this.cdr.detectChanges();
      }
    });
  }
}