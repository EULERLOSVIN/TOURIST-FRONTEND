import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail.page',
  imports: [CommonModule],
  templateUrl: './detail.page.html',
  styleUrl: './detail.page.scss',
})
export class DetailPage implements OnInit{
  private location = inject(Location);
  private router = inject(Router); // Inyectamos el Router
  destinoSeleccionado: any;

  constructor() {
    // CAPTURA INMEDIATA: Leemos el estado en el constructor antes de que la vista se dibuje
    const navigation = this.router.getCurrentNavigation();
    this.destinoSeleccionado = navigation?.extras.state?.['data'];
  }

  ngOnInit(): void {
    // CAPTURA DE RESPALDO: Si por alguna razón el constructor no lo tomó a tiempo,
    // lo extraemos del historial del navegador.
    if (!this.destinoSeleccionado) {
      this.destinoSeleccionado = history.state?.['data'];
    }
    
    // Imprime esto en tu consola del navegador (F12) para auditar qué está llegando
    console.log('Datos del destino recibidos:', this.destinoSeleccionado);
  }

  regresar(): void {
    this.location.back();
  }

  irAResenas(elemento: HTMLElement): void {
    elemento.scrollIntoView({ behavior: 'smooth' });
  }
}
