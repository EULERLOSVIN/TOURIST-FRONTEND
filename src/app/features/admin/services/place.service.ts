import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Result } from '../../../shared/models/result.model';
import {
    CategoryLookupDto,
    RegisterPlaceRequestDto,
    UpdatePlaceRequestDto,
    PlaceFilterRequestDto,
    PlaceDetailsDto,
    PagedResultDto
} from '../models/place.model';

@Injectable({
    providedIn: 'root'
})
export class PlaceService {
    private readonly apiUrl = `${environment.apiUrl}/Places`; // Se conecta al PlacesController

    constructor(private readonly http: HttpClient) { }

    // ==========================================
    // 🏷️ ENDPOINTS DE METADATOS (COMBOS)
    // ==========================================

    /**
     * Carga las categorías desde el backend para llenar el combobox de filtros o formularios
     */
    getPlacesCategories(): Observable<Result<CategoryLookupDto[]>> {
        return this.http.get<Result<CategoryLookupDto[]>>(`${this.apiUrl}/categories`);
    }

    // ==========================================
    // 🗺️ ENDPOINTS DE GESTIÓN (CRUD ATRACTIVOS)
    // ==========================================

    /**
     * Registra un atractivo turístico subiendo las imágenes Base64 automáticas a ImgBB
     */
    registerPlace(place: RegisterPlaceRequestDto): Observable<Result<boolean>> {
        return this.http.post<Result<boolean>>(`${this.apiUrl}/register`, place);
    }

    /**
     * Modifica los datos de un atractivo turístico y refresca de forma segura sus tablas hijas
     */
    updatePlace(place: UpdatePlaceRequestDto): Observable<Result<boolean>> {
        return this.http.put<Result<boolean>>(`${this.apiUrl}/update`, place);
    }

    /**
     * Elimina en cascada controlada el atractivo y todos sus registros vinculados
     */
    deletePlace(id: number): Observable<Result<boolean>> {
        return this.http.delete<Result<boolean>>(`${this.apiUrl}/delete/${id}`);
    }

    /**
     * Obtiene la lista de atractivos turísticos paginada y con filtros dinámicos en tiempo real
     */
    getPagedPlaces(filters: PlaceFilterRequestDto): Observable<Result<PagedResultDto<PlaceDetailsDto>>> {
        let params = new HttpParams()
            .set('pageNumber', filters.pageNumber.toString())
            .set('pageSize', filters.pageSize.toString());

        // Inyección condicional de parámetros por QueryString como pide tu backend
        if (filters.searchTerm && filters.searchTerm.trim() !== '') {
            params = params.set('searchTerm', filters.searchTerm.trim());
        }

        if (filters.idCategoryOfPlace && filters.idCategoryOfPlace > 0) {
            params = params.set('idCategoryOfPlace', filters.idCategoryOfPlace.toString());
        }

        if (filters.destinationState && filters.destinationState.trim() !== '') {
            params = params.set('destinationState', filters.destinationState.trim());
        }

        return this.http.get<Result<PagedResultDto<PlaceDetailsDto>>>(`${this.apiUrl}/list`, { params });
    }
}