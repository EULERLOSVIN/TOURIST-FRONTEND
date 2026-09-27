import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PlaceService } from '../../../admin/services/place.service';
import { TouristPlaceService } from '../../services/tourist-place.service';
import { ConfigurationService } from '../../../admin/services/configuration.service';
import { TouristPlaceDetailsDto, TouristPlaceFilterRequestDto } from '../../models/tourist-place.model';
import { CategoryLookupDto } from '../../../admin/models/place.model';
import { SystemConfigDto } from '../../../admin/models/configuration.model';

@Component({
  selector: 'app-home.page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  // Datos reactivos procedentes del Servidor
  destinos: TouristPlaceDetailsDto[] = [];
  categorias: CategoryLookupDto[] = [];
  
  // 🚀 Objeto para almacenar la configuración de la Portada Principal
  systemConfig: SystemConfigDto = {
    idSystemConfig: 0,
    titleMain: 'Explora la Bella Durmiente',
    subtitle: 'Descubre cataratas cristalinas, cuevas misteriosas y la magia inexplorada de Tingo María.',
    urlImageMain: 'img/selva3.png',
    urlLoginImage: ''
  };

  cargando: boolean = true;
  categoriaActivaId: number = 0; // 0 significa "Todos"

  // 📄 Control de Paginación Dinámica
  totalPages: number = 0;
  totalItems: number = 0;

  // Estructura de filtros pública
  filtros: TouristPlaceFilterRequestDto = {
    searchTerm: '',
    idCategoryOfPlace: 0,
    pageNumber: 1,
    pageSize: 9
  };

  favoritosLocales: Set<number> = new Set<number>();
  private readonly buscadorSubject = new Subject<string>();

  constructor(
    private readonly placeService: PlaceService,
    private readonly touristPlaceService: TouristPlaceService,
    private readonly configService: ConfigurationService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.inicializarBuscadorReactivo();
  }

  /**
   * Carga en paralelo: Categorías, Destinos y Configuración de Portada (SQL Server)
   */
  cargarDatosIniciales(): void {
    this.cargando = true;
    forkJoin({
      categoriasRes: this.placeService.getPlacesCategories(),
      destinosRes: this.touristPlaceService.getTouristPlaces(this.filtros),
      configRes: this.configService.getSystemConfig()
    }).subscribe({
      next: (res) => {
        if (res.categoriasRes.isSuccess) {
          this.categorias = res.categoriasRes.value;
        }
        if (res.destinosRes.isSuccess && res.destinosRes.value) {
          this.destinos = res.destinosRes.value.items;
          this.totalPages = res.destinosRes.value.totalPages;
          this.totalItems = res.destinosRes.value.totalItems;
        }
        if (res.configRes.isSuccess && res.configRes.value) {
          if (res.configRes.value.titleMain) {
            this.systemConfig.titleMain = res.configRes.value.titleMain;
          }
          if (res.configRes.value.subtitle) {
            this.systemConfig.subtitle = res.configRes.value.subtitle;
          }
          if (res.configRes.value.urlImageMain) {
            this.systemConfig.urlImageMain = res.configRes.value.urlImageMain;
          }
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al inicializar la landing de TingoGo:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private inicializarBuscadorReactivo(): void {
    this.buscadorSubject.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(() => {
      this.consultarDestinos(true);
    });
  }

  onSearchInput(): void {
    this.buscadorSubject.next(this.filtros.searchTerm ?? '');
  }

  filtrarPorCategoria(idCategory: number): void {
    this.categoriaActivaId = idCategory;
    this.filtros.idCategoryOfPlace = idCategory;
    this.consultarDestinos(true);
  }

  consultarDestinos(reiniciarPagina: boolean = false): void {
    if (reiniciarPagina) this.filtros.pageNumber = 1;
    this.cargando = true;

    this.touristPlaceService.getTouristPlaces(this.filtros).subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          this.destinos = res.value.items;
          this.totalPages = res.value.totalPages;
          this.totalItems = res.value.totalItems;
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al filtrar destinos públicos:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🎯 MÉTODO PARA NAVEGAR ENTRE PÁGINAS
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
      this.filtros.pageNumber = nuevaPagina;
      this.consultarDestinos(false);
    }
  }

  toggleFavorito(idPlace: number): void {
    if (this.favoritosLocales.has(idPlace)) {
      this.favoritosLocales.delete(idPlace);
    } else {
      this.favoritosLocales.add(idPlace);
    }
  }

  esFavorito(idPlace: number): boolean {
    return this.favoritosLocales.has(idPlace);
  }

  ngOnDestroy(): void {
    this.buscadorSubject.complete();
  }
}