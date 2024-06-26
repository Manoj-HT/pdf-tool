import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage/local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private localStorageService = inject(LocalStorageService)
  private router = inject(Router)
  logOut(){
    this.localStorageService.removeId()
    this.localStorageService.removeToken()
    this.router.navigate(['login'])
  }
}
