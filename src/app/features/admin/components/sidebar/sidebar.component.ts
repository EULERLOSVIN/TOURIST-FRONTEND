import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private router = inject(Router);

  cerrarSesion(): void {
    // Aquí más adelante vaciarás el localStorage/sessionStorage o tu Token JWT
    console.log('Efectuando cierre de sesión administrativo...');
    
    // Redirige al login administrativo o al home público
    this.router.navigate(['/admin/login']);
  }
}
