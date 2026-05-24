import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-place.page',
  imports: [],
  templateUrl: './new-place.page.html',
  styleUrl: './new-place.page.scss',
})
export class NewPlacePage {
  constructor(private router: Router) { }

  guardarLugar(): void {
    // Aquí recolectas la información del formulario e integras tu petición HTTP
    // con el backend en .NET / C# para impactar la base de datos SQL Server.
    console.log('Registrando nuevo atractivo turístico en Tingo María...');

    // Una vez guardado con éxito, redirige de vuelta al panel de control de lugares
    this.router.navigate(['/admin/place']);
  }
}
