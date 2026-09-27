import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Result } from '../../../shared/models/result.model';
import { DashboardMetricsDto } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Apunta directamente al DashboardController de .NET Core
  private readonly apiUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Obtiene de una sola petición todas las métricas, KPIs, 
   * el gráfico de reseñas por lugar y la tabla de pendientes de aprobación
   */
  getDashboardMetrics(): Observable<Result<DashboardMetricsDto>> {
    return this.http.get<Result<DashboardMetricsDto>>(`${this.apiUrl}/metrics`);
  }
}