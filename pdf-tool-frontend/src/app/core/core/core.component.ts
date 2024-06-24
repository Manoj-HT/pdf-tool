import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavService } from '../../navigation/nav-service/nav-service.service';
import { NavBarComponent } from '../../navigation/nav-bar/nav-bar.component';
const CoreImports = [RouterOutlet, NavBarComponent]
@Component({
  selector: 'core',
  standalone: true,
  imports: [CoreImports],
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss'
})
export class CoreComponent {

  navService = inject(NavService)

}
