import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Result } from '../../../shared/models/result.model';
import { PagedResultDto } from '../../admin/models/place.model'; // Reutilizamos el envoltorio de paginación global
import {
    TouristPlaceFilterRequestDto,
    TouristPlaceDetailsDto,
    AddCommentRequestDto
} from '../models/tourist-place.model';

@Injectable({
    providedIn: 'root'
})
export class TouristPlaceService {
    // Se conecta al controlador unificado de Places en tu backend
    private readonly apiUrl = `${environment.apiUrl}/Places`; 

    constructor(private readonly http: HttpClient) { }

    /**
     * Obtiene el catálogo de destinos turísticos con sus comentarios para el feed público
     */
    getTouristPlaces(filters: TouristPlaceFilterRequestDto): Observable<Result<PagedResultDto<TouristPlaceDetailsDto>>> {
        let params = new HttpParams()
            .set('pageNumber', filters.pageNumber.toString())
            .set('pageSize', filters.pageSize.toString());

        // Inyección condicional de filtros para el turista
        if (filters.searchTerm && filters.searchTerm.trim() !== '') {
            params = params.set('searchTerm', filters.searchTerm.trim());
        }

        if (filters.idCategoryOfPlace && filters.idCategoryOfPlace > 0) {
            params = params.set('idCategoryOfPlace', filters.idCategoryOfPlace.toString());
        }

        return this.http.get<Result<PagedResultDto<TouristPlaceDetailsDto>>>(`${this.apiUrl}/tourist-list`, { params });
    }

    /**
     * Envía la opinión del usuario conectándose al endpoint transaccional del controlador
     */
    addPlaceComment(comment: AddCommentRequestDto): Observable<Result<boolean>> {
        return this.http.post<Result<boolean>>(`${this.apiUrl}/add-comment`, comment);
    }
}