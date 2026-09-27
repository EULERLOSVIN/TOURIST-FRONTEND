import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { CommentModerationDto } from '../../models/review.model';
import { PlaceReviewChartDto } from '../../models/dashboard.model';

// Interfaz extendida para renderizar la altura proporcional de las barras
interface ChartRenderItem extends PlaceReviewChartDto {
  percentageHeight: number;
}

@Component({
  selector: 'app-dashboard.page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  cargando: boolean = true;

  // KPIs
  totalLugares: number = 0;
  totalTrabajadores: number = 0;
  totalResenasAprobadas: number = 0;
  totalResenasPendientes: number = 0;

  // Listas para la vista
  resenasPendientes: CommentModerationDto[] = [];
  chartData: ChartRenderItem[] = [];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMetrics();
  }

  /**
   * Consume el endpoint consolidado /api/Dashboard/metrics
   */
  cargarMetrics(): void {
    this.cargando = true;

    this.dashboardService.getDashboardMetrics().subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          const data = res.value;

          // 1. Asignar KPIs recibidos desde la BD
          this.totalLugares = data.totalPlaces;
          this.totalTrabajadores = data.totalWorkers;
          this.totalResenasAprobadas = data.totalApprovedReviews;
          this.totalResenasPendientes = data.totalPendingReviews;

          // 2. Asignar la tabla de reseñas en estado Pendiente
          this.resenasPendientes = data.pendingReviews;

          // 3. Procesar las alturas relativas de las barras (Total Reseñas vs Lugar)
          this.procesarGrafico(data.chartData);
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las métricas del dashboard:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Calcula la altura en porcentaje (%) de cada barra tomando como referencia 100% el lugar con más reseñas
   */
  private procesarGrafico(rawChartData: PlaceReviewChartDto[]): void {
    if (!rawChartData || rawChartData.length === 0) {
      this.chartData = [];
      return;
    }

    // Encuentra la mayor cantidad de reseñas entre los lugares para usarla como tope (100%)
    const maxCount = Math.max(...rawChartData.map(item => item.reviewCount), 1);

    this.chartData = rawChartData.map(item => ({
      ...item,
      // Asigna un mínimo de 15% de altura para que la barra siempre sea visible en la interfaz
      percentageHeight: Math.max(15, Math.round((item.reviewCount / maxCount) * 100))
    }));
  }
}