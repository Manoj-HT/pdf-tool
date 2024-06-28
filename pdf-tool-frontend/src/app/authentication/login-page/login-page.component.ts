import { Component, inject, signal } from '@angular/core';
import { PasswordLoginComponent } from '../password-login/password-login.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { NavService } from '../../navigation/nav-service/nav-service.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage/local-storage.service';

const LoginPageImports = [PasswordLoginComponent, CreateUserComponent];
@Component({
  selector: 'login-page',
  standalone: true,
  imports: [LoginPageImports],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  navService = inject(NavService);
  private router = inject(Router)
  private storage = inject(LocalStorageService)
  ngOnInit(): void {
    this.navService.setNavigation(false);
  }

  case : "login" | "create" = "login"
  dialog = signal(false)
  text! : string
  joined(e : {state : boolean}){
    if(e.state){
      this.text = "User created succesfully"
      this.dialog.set(true)
      this.case = "login"
    }else{
      this.text = "Error creating user"
      this.dialog.set(true)
    }
  }

  checkLoggedIn(){
    if(this.storage.getToken()){
      this.router.navigate(['pdf-management'])
    }
  }

  loggedIn(e : {state : boolean}){
    if(e.state){
      this.router.navigate(['pdf-management'])
    }else{
      this.text = "Email or Password entered is wrong. Please check your details."
      this.dialog.set(true)
    }
  }

  ngOnDestroy(): void {
    this.navService.setNavigation(true);
  }

}
