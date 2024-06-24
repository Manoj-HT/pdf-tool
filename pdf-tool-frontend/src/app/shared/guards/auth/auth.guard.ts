import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  let localStorage = inject(LocalStorageService);
  if (localStorage.getToken() == null) {
    new Router().navigate(['/login']);
    return false;
  }
  return true;
};
