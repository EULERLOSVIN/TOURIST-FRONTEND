import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Result } from '../../../shared/models/result.model';
import { PagedResultDto } from '../models/place.model'; // Reutilizamos el envoltorio de paginación
import { CommentFilterRequestDto, CommentModerationDto } from '../models/review.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    // Se conecta directamente a tu ReviewController en .NET Core
    private readonly apiUrl = `${environment.apiUrl}/Review`;

    constructor(private readonly http: HttpClient) { }

    // ==========================================
    // 💬 ENDPOINTS DE MODERACIÓN DE RESEÑAS
    // ==========================================

    /**
     * Obtiene el listado de reseñas paginadas con filtros dinámicos (estado y término de búsqueda)
     */
    getPagedComments(filters: CommentFilterRequestDto): Observable<Result<PagedResultDto<CommentModerationDto>>> {
        let params = new HttpParams()
            .set('pageNumber', filters.pageNumber.toString())
            .set('pageSize', filters.pageSize.toString());

        // Inyección condicional del buscador por QueryString
        if (filters.searchTerm && filters.searchTerm.trim() !== '') {
            params = params.set('searchTerm', filters.searchTerm.trim());
        }

        // Inyección condicional del filtro por estado ('Pendiente' o 'Aprobado')
        if (filters.state && filters.state.trim() !== '') {
            params = params.set('state', filters.state.trim());
        }

        return this.http.get<Result<PagedResultDto<CommentModerationDto>>>(`${this.apiUrl}/list`, { params });
    }

    /**
     * Cambia el estado de una reseña a Aprobado (idCommentState = 2)
     */
    approveComment(id: number): Observable<Result<boolean>> {
        return this.http.put<Result<boolean>>(`${this.apiUrl}/approve/${id}`, {});
    }

    /**
     * Elimina físicamente la reseña de SQL Server cuando es rechazada o marcada como spam
     */
    rejectComment(id: number): Observable<Result<boolean>> {
        return this.http.delete<Result<boolean>>(`${this.apiUrl}/reject/${id}`);
    }
}