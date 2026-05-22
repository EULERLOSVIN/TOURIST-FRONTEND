import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { DeleteModalComponent } from "../../components/delete-modal/delete-modal.component";

@Component({
  selector: 'app-place.page',
  imports: [CommonModule, RouterLink, DeleteModalComponent],
  templateUrl: './place.page.html',
  styleUrl: './place.page.scss',
})
export class PlacePage {
  // Tu lista de lugares turísticos reales o simulados
  lugares = [
    { id: 1, nombre: 'Cueva de las Pavas', categoria: 'Cuevas', estado: 'publicado', opiniones: 120, rating: 4.9 },
    { id: 2, nombre: 'La Bella Durmiente', categoria: 'Miradores', estado: 'publicado', opiniones: 340, rating: 4.8 },
    { id: 3, nombre: 'Catarata San Miguel', categoria: 'Cataratas', estado: 'borrador', opiniones: 0, rating: 0 }
  ];

  // Control de estado del modal
  mostrarModalEliminar: boolean = false;
  lugarSeleccionado: any = null;

  // Se ejecuta al dar clic en el tachito rojo
  abrirModalEliminar(lugar: any): void {
    this.lugarSeleccionado = lugar;
    this.mostrarModalEliminar = true;
  }

  // Si el administrador da clic en "Sí, eliminar"
  ejecutarEliminacion(): void {
    if (this.lugarSeleccionado) {
      // Aquí harías la llamada a tu servicio de C# / .NET para borrar de la base de datos SQL Server
      console.log(`Eliminando permanentemente: ${this.lugarSeleccionado.nombre}`);

      // Filtramos la lista para simular el borrado en tiempo real en el diseño
      this.lugares = this.lugares.filter(l => l.id !== this.lugarSeleccionado.id);
    }
    this.cerrarModal();
  }

  // Si da clic en cancelar o fuera de la caja
  cerrarModal(): void {
    this.mostrarModalEliminar = false;
    this.lugarSeleccionado = null;
  }
}
