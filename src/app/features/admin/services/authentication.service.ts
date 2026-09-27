import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Result } from '../../../shared/models/result.model';

// 👇 Importación limpia desde tu carpeta de modelos modularizada
import {
    LoginRequestDto,
    LoginResponseDto,
    RegisterRequestDto,
    UpdateUserRequestDto,
    UserDetailsDto,
    UserFilterRequestDto,
    PagedResultDto,
    RoleLookupDto,
    AccountStateLookupDto,
    WorkersPageSummaryDto
} from '../models/authentication.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly apiUrl = `${environment.apiUrl}/Auth`;

    constructor(private readonly http: HttpClient) { }

    // ==========================================
    // 🔐 ENDPOINTS DE ACCESO (LOGIN / LOGOUT)
    // ==========================================

    login(credentials: LoginRequestDto): Observable<Result<LoginResponseDto>> {
        return this.http.post<Result<LoginResponseDto>>(`${this.apiUrl}/login`, credentials);
    }

    logout(): Observable<Result<boolean>> {
        return this.http.post<Result<boolean>>(`${this.apiUrl}/logout`, {});
    }

    // ==========================================
    // 👥 ENDPOINTS DE GESTIÓN (CRUD TRABAJADORES)
    // ==========================================

    registerUser(user: RegisterRequestDto): Observable<Result<boolean>> {
        return this.http.post<Result<boolean>>(`${this.apiUrl}/register`, user);
    }

    updateUser(user: UpdateUserRequestDto): Observable<Result<boolean>> {
        return this.http.put<Result<boolean>>(`${this.apiUrl}/update`, user);
    }

    deleteUser(id: number): Observable<Result<boolean>> {
        return this.http.delete<Result<boolean>>(`${this.apiUrl}/delete/${id}`);
    }

    getUserDetails(id: number): Observable<Result<UserDetailsDto>> {
        return this.http.get<Result<UserDetailsDto>>(`${this.apiUrl}/details/${id}`);
    }

    getPagedUsers(filters: UserFilterRequestDto): Observable<Result<PagedResultDto<UserDetailsDto>>> {
        let params = new HttpParams()
            .set('pageNumber', filters.pageNumber.toString())
            .set('pageSize', filters.pageSize.toString());

        if (filters.searchTerm && filters.searchTerm.trim() !== '') {
            params = params.set('searchTerm', filters.searchTerm.trim());
        }
        if (filters.idRole && filters.idRole > 0) {
            params = params.set('idRole', filters.idRole.toString());
        }
        if (filters.idAccountState && filters.idAccountState > 0) {
            params = params.set('idAccountState', filters.idAccountState.toString());
        }

        return this.http.get<Result<PagedResultDto<UserDetailsDto>>>(`${this.apiUrl}/list`, { params });
    }

    // =========================================================================
    // 📊 NUEVO ENDPOINT: METADATOS (TARJETAS INICIALES Y COMBOS DEL FORMULARIO)
    // =========================================================================
    getWorkersSummary(): Observable<Result<WorkersPageSummaryDto>> {
        return this.http.get<Result<WorkersPageSummaryDto>>(`${this.apiUrl}/summary`);
    }
}