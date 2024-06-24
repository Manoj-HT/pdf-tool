import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private isNav = signal(true);
  setNavigation(state: boolean) {
    this.isNav.set(state);
  }

  getNavigationState() {
    return this.isNav;
  }
}
