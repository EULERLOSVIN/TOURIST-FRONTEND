import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {

  // Lista de destinos (Tarjetas)
  destinos: Destino[] = [
    {
      id: 1,
      titulo: 'Parque Nacional Tingo María',
      categoria: 'Naturaleza',
      claseCategoria: 'bg-success-dark',
      ubicacion: 'Huánuco, Perú',
      imagen: 'img/lugar5.webp',
      esFavorito: false
    },
    {
      id: 2,
      titulo: 'Cueva de las Lechuzas',
      categoria: 'Cuevas',
      claseCategoria: 'bg-blue-dark',
      ubicacion: 'Faldas de la Bella Durmiente',
      imagen: 'img/lugar3.jpg',
      esFavorito: true
    },
    {
      id: 3,
      titulo: 'Catarata Santa Carmen',
      categoria: 'Cataratas',
      claseCategoria: 'bg-teal-dark',
      ubicacion: 'Castillo Grande',
      imagen: 'img/lugar6.png',
      esFavorito: false
    },
    {
      id: 4,
      titulo: 'Mirador San Francisco',
      categoria: 'Miradores',
      claseCategoria: 'bg-olive-dark',
      ubicacion: 'Tingo María',
      imagen: 'img/lugar7.webp',
      esFavorito: false
    }
  ];

  // Función opcional por si quieres cambiar el estado del corazón al hacer clic
  toggleFavorito(destino: Destino): void {
    destino.esFavorito = !destino.esFavorito;
  }

}
