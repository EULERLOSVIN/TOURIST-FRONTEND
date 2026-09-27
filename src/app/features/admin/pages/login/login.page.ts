import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { ConfigurationService } from '../../services/configuration.service'; // 🚀 Inyectamos el servicio de configuración

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // 🚀 URL dinámica del fondo de pantalla (con fallback a la ruta estática por defecto)
  loginBgUrl: string = 'img/portada2.jpg';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthenticationService,
    private readonly configService: ConfigurationService, // 👈 Inyección de dependencias
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Cargar la imagen de fondo guardada en la BD desde la API
    this.cargarFondoLogin();
  }

  /**
   * Obtiene la URL guardada en SQL Server para el fondo de pantalla del Login
   */
  private cargarFondoLogin(): void {
    this.configService.getSystemConfig().subscribe({
      next: (res) => {
        if (res.isSuccess && res.value && res.value.urlLoginImage) {
          this.loginBgUrl = res.value.urlLoginImage;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al cargar la imagen de fondo del login:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = ''; 

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          localStorage.setItem('token', response.value.token);
          localStorage.setItem('userName', response.value.name);
          localStorage.setItem('userRole', response.value.role);

          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = response.errorMessage;
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error del servidor:', err.error);
        this.errorMessage = err.error?.errorMessage || 'Correo o contraseña incorrectos';
        
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}