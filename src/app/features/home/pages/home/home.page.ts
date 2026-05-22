import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
interface Destino {
  id: number;
  titulo: string;
  categoria: string;
  claseCategoria: string; // Para aplicar el color del badge dinámicamente
  ubicacion: string;
  imagen: string;
  esFavorito: boolean;
}

@Component({
  selector: 'app-home.page',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {

  destinos: any[] = [
    {
      id: 1,
      titulo: 'Parque Nacional Tingo María',
      categoria: 'Naturaleza',
      claseCategoria: 'bg-success-dark',
      ubicacion: 'Huánuco, Perú',
      imagen: 'img/lugar5.webp',
      galeria: ['img/lugar5.webp', 'img/lugar3.jpg', 'img/lugar6.png'], // AC1: Galería de fotos
      descripcionExtensa: 'El Parque Nacional Tingo María es una de las áreas naturales protegidas más antiguas del Perú. Alberga una biodiversidad única y la mítica cadena montañosa de la Bella Durmiente.', // AC1
      horario: 'Lunes a Domingo: 8:00 AM - 4:00 PM', // AC1
      recomendaciones: 'Llevar repelente biodegradable, zapatillas de trekking, agua y cámara fotográfica.', // AC1
      esFavorito: false
    },
    {
      id: 2,
      titulo: 'Cueva de las Lechuzas',
      categoria: 'Cuevas',
      claseCategoria: 'bg-blue-dark',
      ubicacion: 'Faldas de la Bella Durmiente',
      imagen: 'img/lugar3.jpg',
      galeria: ['img/lugar3.jpg', 'img/lugar5.webp', 'img/lugar7.webp'], // AC1
      descripcionExtensa: 'Una espectacular y enorme gruta de piedra caliza que se interna en las profundidades de la Bella Durmiente, habitada por importantes colonias de guácharos y murciélagos.', // AC1
      horario: 'Lunes a Domingo: 8:00 AM - 5:00 PM', // AC1
      recomendaciones: 'Llevar linterna potente, calzado con buen agarre antideslizante y usar repelente.', // AC1
      esFavorito: true
    },
    {
      id: 3,
      titulo: 'Catarata Santa Carmen',
      categoria: 'Cataratas',
      claseCategoria: 'bg-teal-dark',
      ubicacion: 'Castillo Grande',
      imagen: 'img/lugar6.png',
      galeria: ['img/lugar6.png', 'img/lugar5.webp', 'img/lugar3.jpg'], // AC1
      descripcionExtensa: 'Hermosa caída de agua cristalina de aproximadamente 30 metros que forma una refrescante piscina natural ideal para nadar y relajarse rodeado de densa selva.', // AC1
      horario: 'Lunes a Domingo: 8:00 AM - 4:30 PM', // AC1
      recomendaciones: 'Llevar ropa de baño, toalla, aquashoes y protector solar amigable con el ambiente.', // AC1
      esFavorito: false
    },
    {
      id: 4,
      titulo: 'Mirador San Francisco',
      categoria: 'Miradores',
      claseCategoria: 'bg-olive-dark',
      ubicacion: 'Tingo María',
      imagen: 'img/lugar7.webp',
      galeria: ['img/lugar7.webp', 'img/lugar6.png', 'img/lugar3.jpg'], // AC1
      descripcionExtensa: 'El punto estratégico perfecto para contemplar en todo su esplendor la silueta completa de La Bella Durmiente, la ciudad de Tingo María y el río Huallaga.', // AC1
      horario: 'Acceso libre (Recomendado de 5:00 AM a 6:30 PM)', // AC1
      recomendaciones: 'Visitar durante el amanecer o atardecer, llevar lentes de sol y abrigo ligero para la tarde.', // AC1
      esFavorito: false
    }
  ];

  // Función opcional por si quieres cambiar el estado del corazón al hacer clic
  toggleFavorito(destino: Destino): void {
    destino.esFavorito = !destino.esFavorito;
  }
}
