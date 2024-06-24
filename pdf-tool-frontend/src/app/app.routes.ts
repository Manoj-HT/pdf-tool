import { Routes } from '@angular/router';
import { PrivateRoutes, PublicRoutes } from './core/core.routes';

export const routes: Routes = [
  ...PrivateRoutes(),
  ...PublicRoutes,
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
