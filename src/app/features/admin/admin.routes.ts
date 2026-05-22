import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: '',
    loadComponent: () => import('../../layouts/admin/admin.layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'workers',
        loadComponent: () => import('./pages/workers/workers.page').then(m => m.WorkersPage)
      },
      {
        path: 'place',
        loadComponent: () => import('./pages/place/place.page').then(m => m.PlacePage),    
      },
      /* NAVEGACIÓN INDEPENDIENTE DE EDICIÓN (RECOMENDADA) */
      {
        path: 'place/edit',
        loadComponent: () => import('./pages/edit-place/edit-place.page').then(m => m.EditPlacePage)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/reviews/reviews.page').then(m => m.ReviewsPage)
      },
      {
        path: 'configuration',
        loadComponent: () => import('./pages/configuration/configuration.page').then(m => m.ConfigurationPage)
      },
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      }
    ]
  }
];