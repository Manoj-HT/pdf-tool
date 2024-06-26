import { Routes } from '@angular/router';
import { LoginPageComponent } from '../authentication/login-page/login-page.component';
import { authGuard } from '../shared/guards/auth/auth.guard';
import { PdfManagementComponent } from '../pdf-management/pdf-management.component';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';

export const PublicRoutes = [
  {
    path: 'login',
    loadComponent: () => LoginPageComponent,
  },
] as Routes;

const routes = [
  {
    path: 'pdf-management',
    loadComponent: () => PdfManagementComponent,
  },
  {
    path : 'view/:id',
    loadComponent : () => PdfViewerComponent
  }
] as Routes;

export const PrivateRoutes = () => {
  for (let route of routes) {
    route.canActivate = [authGuard];
  }
  return routes;
};
