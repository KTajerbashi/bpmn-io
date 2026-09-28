import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users-management/users-management').then((x) => x.UsersManagement),
  },
  {
    path: 'roles',
    loadComponent: () => import('./role-management/role-management').then((x) => x.RoleManagement),
  },
  {
    path: 'groups',
    loadComponent: () =>
      import('./groups-management/groups-management').then((x) => x.GroupsManagement),
  },
  {
    path: 'forms',
    loadComponent: () =>
      import('./forms-management/forms-management').then((x) => x.FormsManagement),
  },
  {
    path: 'designer',
    loadComponent: () => import('./designer/designer').then((x) => x.Designer),
  },
  {
    path: 'processes',
    loadComponent: () => import('./processes/processes').then((x) => x.Processes),
  },
  {
    path: 'templates',
    loadComponent: () => import('./templates/templates').then((x) => x.Templates),
  },
];
