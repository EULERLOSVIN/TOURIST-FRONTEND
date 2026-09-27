import { CommentModerationDto } from './review.model';

// DTO para representar cada barra del gráfico (Cantidad Total de Reseñas por Lugar)
export interface PlaceReviewChartDto {
  placeName: string;
  reviewCount: number;
}

// DTO principal que mapea la respuesta consolidada de GET api/Dashboard/metrics
export interface DashboardMetricsDto {
  totalPlaces: number;
  totalWorkers: number;
  totalApprovedReviews: number;
  totalPendingReviews: number;
  chartData: PlaceReviewChartDto[];
  pendingReviews: CommentModerationDto[];
}