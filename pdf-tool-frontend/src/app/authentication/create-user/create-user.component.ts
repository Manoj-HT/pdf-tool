import { Component, inject, output } from '@angular/core';
import { FormElements } from '../../shared/components/form-elements/form_elements';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api/api.service';
import { User } from '../../shared/models/user';
const CreateUserImports = [FormElements];
@Component({
  selector: 'create-user',
  standalone: true,
  imports: [CreateUserImports],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  joined = output<{state : boolean}>()
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  join() {
    let value = this.form.value as User;
    this.apiService.createUser(value).subscribe({
      next: (res) => {
        console.log(res);
        this.joined.emit({state : true})
      },
      error : (err) => {
        console.log(err);
        this.joined.emit({state : false})
      }
    });
  }
}
