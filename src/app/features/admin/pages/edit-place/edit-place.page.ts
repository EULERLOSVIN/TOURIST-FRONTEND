import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { PlaceService } from '../../services/place.service';
import { CategoryLookupDto, UpdatePlaceRequestDto } from '../../models/place.model';

@Component({
  selector: 'app-edit-place.page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './edit-place.page.html',
  styleUrl: './edit-place.page.scss',
})
export class EditPlacePage implements OnInit {
  idPlace!: number;
  categorias: CategoryLookupDto[] = [];
  cargando: boolean = true;

  // Variable reactiva para la caja de texto de nuevas actividades
  nuevaActividad: string = '';

  placeDto: UpdatePlaceRequestDto = {
    idPlace: 0,
    title: '',
    description: '',
    city: '',
    googleMapsLink: '',
    schedule: '',
    priceAdult: 0,
    priceChild: 0,
    stateToPublic: true,
    idCategory: 0,
    gallery: [], 
    recommendations: '',
    activitiesNames: []
  };

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

  mapaUrlSeguro: SafeResourceUrl | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly placeService: PlaceService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.idPlace = Number(params['id']);
        this.placeDto.idPlace = this.idPlace;
        this.cargarMetadatosYDetalles();
      } else {
        console.error('No se detectó un identificador válido en la URL.');
        this.router.navigate(['/admin/place']);
      }
    });
  }

  cargarMetadatosYDetalles(): void {
    this.cargando = true;
    forkJoin({
      categoriasRes: this.placeService.getPlacesCategories(),
      detallesRes: this.placeService.getPagedPlaces({ pageNumber: 1, pageSize: 100 }) 
    }).subscribe({
      next: (res) => {
        if (res.categoriasRes.isSuccess) {
          this.categorias = res.categoriasRes.value;
        }

        if (res.detallesRes.isSuccess && res.detallesRes.value) {
          const entidad = res.detallesRes.value.items.find(x => x.idPlace === this.idPlace);
          if (entidad) {
            this.placeDto.title = entidad.name;
            this.placeDto.description = entidad.description;
            this.placeDto.city = entidad.ubication;
            this.placeDto.googleMapsLink = entidad.linkGoogleMaps;
            this.placeDto.priceAdult = entidad.costAdult;
            this.placeDto.priceChild = entidad.costChild;
            this.placeDto.stateToPublic = entidad.destinationState === 'Abierto al Público';
            this.placeDto.idCategory = entidad.idCategoryOfPlace;
            this.placeDto.gallery = [...entidad.galleryUrls]; 
            
            // Unir recomendaciones si vienen en array
            this.placeDto.recommendations = Array.isArray(entidad.recommendations) 
              ? entidad.recommendations.join(', ') 
              : (entidad.recommendations || '');

            // Mapeo seguro de las actividades existentes
            this.placeDto.activitiesNames = entidad.activities ? [...entidad.activities] : [];

            this.procesarEnlaceMapa();
            this.parsearHorarioExistente(entidad.businessHours);
          }
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al recuperar detalles del destino:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ==========================================
  // 🎯 LÓGICA INTERACTIVA DE ACTIVIDADES
  // ==========================================

  agregarActividad(): void {
    const texto = this.nuevaActividad.trim();
    if (texto.length > 0) {
      if (!this.placeDto.activitiesNames.includes(texto)) {
        this.placeDto.activitiesNames.push(texto);
      }
      this.nuevaActividad = '';
      this.cdr.detectChanges();
    }
  }

  removerActividad(index: number): void {
    this.placeDto.activitiesNames.splice(index, 1);
    this.cdr.detectChanges();
  }

  private parsearHorarioExistente(businessHours: string): void {
    if (!businessHours) return;
    try {
      const partes = businessHours.split(' (');
      if (partes.length >= 2) {
        this.diasSeleccionados = partes[0];
        const horas = partes[1].replace(')', '').split(' - ');
        if (horas.length >= 2) {
          this.horaApertura = this.convertir12a24(horas[0]);
          this.horaCierre = this.convertir12a24(horas[1]);
        }
      }
    } catch (e) {
      console.warn('Uso de valores predeterminados para selectores de hora:', e);
    }
  }

  private convertir12a24(hora12: string): string {
    const [tiempo, ampm] = hora12.split(' ');
    let [horas, minutos] = tiempo.split(':');
    let h = parseInt(horas, 10);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minutos}`;
  }

  abrirGoogleMapsNativo(): void {
    window.open('https://www.google.com/maps/@-9.3000,-76.0000,14z', '_blank');
    const autorecover = () => {
      navigator.clipboard.readText().then(textoCopiado => {
        if (textoCopiado.includes('google.com/maps') || textoCopiado.includes('maps.app.goo.gl')) {
          this.placeDto.googleMapsLink = textoCopiado.trim();
          this.procesarEnlaceMapa();
        }
      }).catch(() => {});
      window.removeEventListener('focus', autorecover);
    };
    window.addEventListener('focus', autorecover);
  }

  procesarEnlaceMapa(): void {
    const url = this.placeDto.googleMapsLink;
    if (!url) {
      this.mapaUrlSeguro = null;
      return;
    }
    const regExCoordenadas = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const coincidencia = url.match(regExCoordenadas);

    if (coincidencia && coincidencia.length >= 3) {
      const embedUrl = `https://maps.google.com/maps?q=${coincidencia[1]},${coincidencia[2]}&z=15&output=embed`;
      this.mapaUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.mapaUrlSeguro = null;
    }
    this.cdr.detectChanges();
  }

  private format12H(timeString: string): string {
    if (!timeString) return '';
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour.toString().padStart(2, '0')}:${minuteStr} ${ampm}`;
  }

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

  removerFoto(index: number): void {
    this.placeDto.gallery.splice(index, 1);
    this.cdr.detectChanges();
  }

  guardarCambios(): void {
    const aperturaFormateada = this.format12H(this.horaApertura);
    const cierreFormateada = this.format12H(this.horaCierre);
    this.placeDto.schedule = `${this.diasSeleccionados} (${aperturaFormateada} - ${cierreFormateada})`;

    if (!this.placeDto.title || this.placeDto.idCategory === 0) {
      alert('Por favor, rellena el nombre y la categoría del destino.');
      return;
    }

    this.placeService.updatePlace(this.placeDto).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.router.navigate(['/admin/place']);
        } else {
          alert(`Error al guardar cambios: ${res.errorMessage}`);
        }
      },
      error: (err) => console.error('Error de red en el servidor:', err)
    });
  }
}