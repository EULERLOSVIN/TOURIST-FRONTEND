import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // 👈 Se agregó RouterLinkActive
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // 👈 Importante incluirlo aquí
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);

  cerrarSesion(): void {
    console.log('Efectuando cierre de sesión administrativo...');

    this.authService.logout().subscribe({
      next: () => {
        this.limpiarSesionLocal();
      },
      error: (err) => {
        console.error('Error al notificar el logout al servidor:', err);
        this.limpiarSesionLocal();
      }
    });
  }

  private limpiarSesionLocal(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');

    this.router.navigate(['/admin/login']);
  }
}