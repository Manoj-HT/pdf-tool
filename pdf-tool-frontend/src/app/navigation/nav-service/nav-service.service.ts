import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  savePdfAnnotations = new BehaviorSubject<boolean>(false);

  private saveState = signal<string>('Save');

  getSaveState() {
    return this.saveState;
  }

  tools: NavBarTools = {
    backButton: false,
    saveButton: false,
  };

  private navBarTools = signal<NavBarTools>(this.tools);

  getNavBarTools() {
    return this.navBarTools;
  }

  setNavBarTools(tool: NavBarTools) {
    this.navBarTools.update(() => tool);
  }

  setSaveState(state: 'Saved' | 'Error') {
    this.saveState.set(state);
    setTimeout(() => {
      this.saveState.set('Save');
    }, 3000);
  }
}

type NavBarTools = {
  saveButton: boolean;
  backButton: boolean;
};
