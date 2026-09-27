import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlaceService } from '../../services/place.service';
import { PlaceDetailsDto } from '../../models/place.model';

@Component({
  selector: 'app-detail-place.page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-place.page.html',
  styleUrl: './detail-place.page.scss',
})
export class DetailPlacePage implements OnInit {
  idPlace!: number;
  lugar: PlaceDetailsDto | null = null; // 👈 Tipado fuertemente con PlaceDetailsDto
  cargando: boolean = true;
  mapaUrlSeguro: SafeResourceUrl | null = null;
  fotoSeleccionada: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly placeService: PlaceService,
    private readonly cdr: ChangeDetectorRef,
    private readonly sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.idPlace = Number(params['id']);
        this.cargarDetallesLugar();
      }
    });
  }

  cargarDetallesLugar(): void {
    this.cargando = true;
    this.placeService.getPagedPlaces({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          const entidad = res.value.items.find(x => x.idPlace === this.idPlace);
          if (entidad) {
            this.lugar = entidad;
            
            // Fijamos la primera imagen como foto destacada en el visor grande
            if (entidad.galleryUrls && entidad.galleryUrls.length > 0) {
              this.fotoSeleccionada = entidad.galleryUrls[0];
            }
            this.procesarEnlaceMapa(entidad.linkGoogleMaps);
          }
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al recuperar detalles:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarFoto(url: string): void {
    this.fotoSeleccionada = url;
  }

  private procesarEnlaceMapa(url: string): void {
    if (!url) return;
    const regExCoordenadas = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const coincidencia = url.match(regExCoordenadas);

    if (coincidencia && coincidencia.length >= 3) {
      const embedUrl = `https://maps.google.com/maps?q=${coincidencia[1]},${coincidencia[2]}&z=15&output=embed`;
      this.mapaUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  }
}