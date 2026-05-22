// src/app/features/home/home.routes.ts
import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/detail/detail.page').then(m => m.DetailPage)
  }
];