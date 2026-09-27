import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Result } from '../../../shared/models/result.model';
import {
    SystemConfigDto,
    SaveHeroConfigDto,
    SaveLoginBgConfigDto
} from '../models/configuration.model';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
    // Apunta al ConfigurationController de .NET Core
    private readonly apiUrl = `${environment.apiUrl}/Configuration`;

    constructor(private readonly http: HttpClient) { }

    // ==========================================
    // ⚙️ ENDPOINTS DE CONFIGURACIÓN DEL SISTEMA
    // ==========================================

    /**
     * Obtiene los parámetros globales actuales (Título, Subtítulo, Imagen de Portada y Fondo de Login)
     */
    getSystemConfig(): Observable<Result<SystemConfigDto>> {
        return this.http.get<Result<SystemConfigDto>>(`${this.apiUrl}`);
    }

    /**
     * Guarda o actualiza los datos de la Tarjeta 1: Portada Principal (Landing)
     */
    saveHeroConfig(data: SaveHeroConfigDto): Observable<Result<boolean>> {
        return this.http.post<Result<boolean>>(`${this.apiUrl}/save-hero`, data);
    }

    /**
     * Guarda o actualiza los datos de la Tarjeta 2: Fondo de Inicio de Sesión Administrativo
     */
    saveLoginBgConfig(data: SaveLoginBgConfigDto): Observable<Result<boolean>> {
        return this.http.post<Result<boolean>>(`${this.apiUrl}/save-login-bg`, data);
    }
}