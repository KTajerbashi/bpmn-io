import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    loadChildren: () => import('./features/routes').then((m) => m.routes),
  },

  {
    path: 'error',
    loadComponent: () => import('./layout/full-layout/full-layout').then((m) => m.FullLayout),
    loadChildren: () => import('./shared/errors/routes').then((m) => m.routes),
  },

  {
    path: '**',
    redirectTo: 'error/404',
  },
];
