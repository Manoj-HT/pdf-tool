import { Component, inject, output, signal } from '@angular/core';
import { FormElements } from '../../shared/components/form-elements/form_elements';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api/api.service';
import { User } from '../../shared/models/user';
import { LocalStorageService } from '../../shared/services/local-storage/local-storage.service';
const PasswordLoginImports = [FormElements];
@Component({
  selector: 'password-login',
  standalone: true,
  imports: [PasswordLoginImports],
  templateUrl: './password-login.component.html',
  styleUrl: './password-login.component.scss',
})
export class PasswordLoginComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService)
  private storage = inject(LocalStorageService)
  loggedIn = output<{state : boolean}>()
  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  login(){
    let value = this.form.value as User
    this.apiService.login(value).subscribe({
      next : (res) => {
        if(res.message == "user doesn't exist"){
          this.loggedIn.emit({state : false})
          return;
        }
        this.storage.setToken(res['token'])
        this.storage.setUserId((res['user'] as User).id)
        this.loggedIn.emit({state : true})
      },
      error : (err) => {
        console.log(err);
        this.loggedIn.emit({state : false})
      }
    })
  }
}
