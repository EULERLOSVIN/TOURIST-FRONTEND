import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';
import { SaveHeroConfigDto, SaveLoginBgConfigDto } from '../../models/configuration.model';

@Component({
  selector: 'app-configuration.page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuration.page.html',
  styleUrl: './configuration.page.scss',
})
export class ConfigurationPage implements OnInit {
  // Estados de carga generales y por botón
  cargandoPagina: boolean = true;
  guardandoHero: boolean = false;
  guardandoLoginBg: boolean = false;

  // 🔔 ESTADO DEL MODAL PERSONALIZADO (En reemplazo de alert)
  mostrarModal: boolean = false;
  modalTipo: 'success' | 'error' | 'warning' = 'success';
  modalTitulo: string = '';
  modalMensaje: string = '';

  // Modelo de la Tarjeta 1: Portada Principal
  heroForm: SaveHeroConfigDto = {
    titleMain: '',
    subtitle: '',
    imageMainBase64OrUrl: ''
  };

  // Modelo de la Tarjeta 2: Fondo Login
  loginBgForm: SaveLoginBgConfigDto = {
    imageLoginBase64OrUrl: ''
  };

  constructor(
    private readonly configService: ConfigurationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  /**
   * Carga los datos actuales desde SQL Server a través del backend .NET
   */
  cargarConfiguracion(): void {
    this.cargandoPagina = true;
    this.configService.getSystemConfig().subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          this.heroForm.titleMain = res.value.titleMain;
          this.heroForm.subtitle = res.value.subtitle;
          this.heroForm.imageMainBase64OrUrl = res.value.urlImageMain;
          this.loginBgForm.imageLoginBase64OrUrl = res.value.urlLoginImage;
        }
        this.cargandoPagina = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar la configuración del sistema:', err);
        this.cargandoPagina = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ==========================================
  // 🖼️ MANEJO DE SELECCIÓN DE IMÁGENES (BASE64)
  // ==========================================

  /**
   * Procesa la nueva imagen seleccionada para la Portada Principal
   */
  onHeroImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.heroForm.imageMainBase64OrUrl = reader.result as string;
        this.cdr.detectChanges();
      };

      reader.readAsDataURL(file);
    }
  }

  /**
   * Procesa la nueva imagen seleccionada para el Fondo de Login
   */
  onLoginBgSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.loginBgForm.imageLoginBase64OrUrl = reader.result as string;
        this.cdr.detectChanges();
      };

      reader.readAsDataURL(file);
    }
  }

  // ==========================================
  // 💾 GUARDADO INDEPENDIENTE POR TARJETA
  // ==========================================

  /**
   * Guarda o actualiza los datos de la Tarjeta 1 (Portada Landing)
   */
  guardarHeroConfig(): void {
    if (!this.heroForm.titleMain.trim() || !this.heroForm.subtitle.trim()) {
      this.abrirModal('warning', 'Campos Incompletos', 'Por favor complete el título y subtítulo de la portada.');
      return;
    }

    this.guardandoHero = true;
    this.configService.saveHeroConfig(this.heroForm).subscribe({
      next: (res) => {
        this.guardandoHero = false;
        if (res.isSuccess) {
          this.abrirModal('success', '¡Portada Actualizada!', 'La portada principal ha sido actualizada correctamente.');
          this.cargarConfiguracion(); // Refrescar URLs desde el servidor
        } else {
          this.abrirModal('error', 'Error al Guardar', res.errorMessage || 'No se pudo guardar la portada.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.guardandoHero = false;
        console.error('Error al guardar portada:', err);
        this.abrirModal('error', 'Error de Conexión', 'Ocurrió un fallo al comunicar con el servidor.');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Guarda o actualiza los datos de la Tarjeta 2 (Fondo Login)
   */
  guardarLoginBgConfig(): void {
    if (!this.loginBgForm.imageLoginBase64OrUrl) {
      this.abrirModal('warning', 'Imagen Requerida', 'Debe seleccionar una imagen para el fondo de inicio de sesión.');
      return;
    }

    this.guardandoLoginBg = true;
    this.configService.saveLoginBgConfig(this.loginBgForm).subscribe({
      next: (res) => {
        this.guardandoLoginBg = false;
        if (res.isSuccess) {
          this.abrirModal('success', '¡Fondo Actualizado!', 'La imagen de inicio de sesión se ha guardado correctamente.');
          this.cargarConfiguracion(); // Refrescar URLs desde el servidor
        } else {
          this.abrirModal('error', 'Error al Guardar', res.errorMessage || 'No se pudo actualizar el fondo de login.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.guardandoLoginBg = false;
        console.error('Error al guardar fondo de login:', err);
        this.abrirModal('error', 'Error de Conexión', 'Ocurrió un fallo al comunicar con el servidor.');
        this.cdr.detectChanges();
      }
    });
  }

  // ==========================================
  // 🔔 MÉTODOS DE CONTROL DEL MODAL
  // ==========================================

  abrirModal(tipo: 'success' | 'error' | 'warning', titulo: string, mensaje: string): void {
    this.modalTipo = tipo;
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }
}