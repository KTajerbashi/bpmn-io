import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },

  {
    path: '500',
    loadComponent: () => import('./server-error/server-error').then((m) => m.ServerError),
  },

  {
    path: '',
    redirectTo: '404',
    pathMatch: 'full',
  },
];
