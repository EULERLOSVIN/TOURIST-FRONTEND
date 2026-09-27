import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // 👈 Importamos Sanitizer para renderizar el mapa seguro
import { PlaceService } from '../../services/place.service';
import { CategoryLookupDto, RegisterPlaceRequestDto } from '../../models/place.model';

@Component({
  selector: 'app-new-place.page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './new-place.page.html',
  styleUrl: './new-place.page.scss',
})
export class NewPlacePage implements OnInit {
  // Lista dinámica de categorías traídas de SQL Server
  categorias: CategoryLookupDto[] = [];

  // Estructura limpia del DTO mapeada con tu backend
  placeDto: RegisterPlaceRequestDto = {
    title: '',
    description: '',
    city: '',
    googleMapsLink: '', // 👈 Aquí se almacenará la URL final limpia
    schedule: '',
    priceAdult: 0,
    priceChild: 0,
    stateToPublic: true, 
    idCategory: 0,
    gallery: [], 
    recommendations: '',
    activitiesNames: []
  };

  // Variables locales de usabilidad para Horarios y Días
  diasSeleccionados: string = 'Lunes a Domingo';
  horaApertura: string = '08:00';
  horaCierre: string = '16:30';

  opcionesDias = [
    'Lunes a Domingo',
    'Lunes a Viernes',
    'Lunes a Sábado',
    'Viernes a Domingo',
    'Solo Fines de Semana'
  ];

  nuevaActividad: string = '';

  // URL sanitizada para renderizar la vista interactiva del mapa en el iframe
  mapaUrlSeguro: SafeResourceUrl | null = null;

  // Inyectamos DomSanitizer junto a tus otros servicios de forma limpia
  constructor(
    private readonly placeService: PlaceService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly sanitizer: DomSanitizer 
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.placeService.getPlacesCategories().subscribe({
      next: (res) => {
        if (res.isSuccess) this.categorias = res.value;
      },
      error: (err) => console.error('Error al recuperar metadatos:', err)
    });
  }

  /**
   * Abre Google Maps enfocado en la zona de Tingo María y se queda escuchando el portapapeles
   */
  abrirGoogleMapsNativo(): void {
    window.open('https://www.google.com/maps/@-9.3000,-76.0000,14z', '_blank');

    // 🚀 AUTOMATIZACIÓN INTELIGENTE: Al volver a enfocar la pestaña, intentamos capturar el link copiado
    const recuperarEnlaceAutomatico = () => {
      navigator.clipboard.readText().then(textoCopiado => {
        if (textoCopiado.includes('google.com/maps') || textoCopiado.includes('maps.app.goo.gl')) {
          this.placeDto.googleMapsLink = textoCopiado.trim();
          this.procesarEnlaceMapa(); // Dispara la previsualización del iframe en tiempo real
        }
      }).catch(err => {
        console.warn('El navegador restringió el acceso directo al portapapeles:', err);
      });

      // Limpiamos el Listener para evitar fugas de memoria
      window.removeEventListener('focus', recuperarEnlaceAutomatico);
    };

    window.addEventListener('focus', recuperarEnlaceAutomatico);
  }

  /**
   * Parsea la URL de Google Maps para extraer las coordenadas y renderizar el mapa
   */
  procesarEnlaceMapa(): void {
    const url = this.placeDto.googleMapsLink;
    if (!url) {
      this.mapaUrlSeguro = null;
      return;
    }

    // Regex para capturar el patrón de coordenadas @lat,lng que genera Google Maps
    const regExCoordenadas = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const coincidencia = url.match(regExCoordenadas);

    if (coincidencia && coincidencia.length >= 3) {
      const lat = coincidencia[1];
      const lng = coincidencia[2];
      
      // Creamos la URL embed para el iframe
      const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
      this.mapaUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.mapaUrlSeguro = null; // Si es un link acortado, igual se guardará, pero no renderiza preview
    }
    this.cdr.detectChanges();
  }

  /**
   * Convierte formatos de 24h (16:30) a un formato amigable de 12h (04:30 PM)
   */
  private format12H(timeString: string): string {
    if (!timeString) return '';
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; 
    return `${hour.toString().padStart(2, '0')}:${minuteStr} ${ampm}`;
  }

  /**
   * Captura los archivos desde el input multiple y los lee asíncronamente como Base64
   */
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.placeDto.gallery.push(e.target.result);
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  /**
   * Procesa el formulario, une las actividades seleccionadas y despacha al API en .NET Core
   */
  guardarLugar(): void {
    // CONCATENACIÓN TRANSACCIONAL: Unimos días y horas para la columna BusinessHours de SQL Server
    const aperturaFormateada = this.format12H(this.horaApertura);
    const cierreFormateada = this.format12H(this.horaCierre);
    this.placeDto.schedule = `${this.diasSeleccionados} (${aperturaFormateada} - ${cierreFormateada})`;

    // Validaciones preventivas en el frontend
    if (!this.placeDto.title || this.placeDto.idCategory === 0) {
      alert('Por favor, ingresa el nombre del atractivo y selecciona una categoría válida.');
      return;
    }

    // Petición HTTP al endpoint transaccional del backend
    this.placeService.registerPlace(this.placeDto).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log('Atractivo turístico registrado exitosamente.');
          this.router.navigate(['/admin/place']); 
        } else {
          alert(`Error al registrar: ${res.errorMessage}`);
        }
      },
      error: (err) => console.error('Error físico en el servidor:', err)
    });
  }

  /**
   * Agrega la actividad escrita por el usuario al DTO principal
   */
  agregarActividad(): void {
    const valor = this.nuevaActividad.trim();

    if (valor !== '') {
      if (!this.placeDto.activitiesNames.includes(valor)) {
        this.placeDto.activitiesNames.push(valor);
      }
      this.nuevaActividad = ''; 
    }
  }

  removerActividad(index: number): void {
    this.placeDto.activitiesNames.splice(index, 1);
  }

  removerFoto(index: number): void {
    this.placeDto.gallery.splice(index, 1);
    this.cdr.detectChanges(); 
  }
}