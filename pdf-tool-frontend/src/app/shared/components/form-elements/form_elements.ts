import { PasswordInputComponent } from './password-input/password-input.component';
import { TextInputComponent } from './text-input/text-input.component';
import { EmailInputComponent } from './email-input/email-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SingleSelectComponent } from './single-select/single-select.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

export const FormElements = [
  TextInputComponent,
  EmailInputComponent,
  PasswordInputComponent,
  TextAreaComponent,
  SingleSelectComponent,
  FileUploadComponent,
  ReactiveFormsModule,
];
