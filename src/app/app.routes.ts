import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main/main.layout';


export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES)
            }
        ]
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    }
];
