import { Component, inject, signal } from '@angular/core';
import { NavService } from '../nav-service/nav-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/auth-service/auth.service';

@Component({
  selector: '[nav-bar]',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  private navService = inject(NavService);
  tools = this.navService.getNavBarTools();
  saveState = this.navService.getSaveState();
  private router = inject(Router);
  private authService = inject(AuthService)
  save() {
    this.navService.savePdfAnnotations.next(true);
  }

  gotoHome() {
    this.router.navigate(['pdf-management']);
  }

  isProfileOptions = signal(false);

  setProfileOptions() {
    this.isProfileOptions.update((s) => !s);
  }

  logout(){
    this.authService.logOut()
  }
}
