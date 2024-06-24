import { Component, input, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  acceptTypeText = model<string>('');
  controlName = input('');
  uploadedFileEvent = output<Event>();
  file = output<File>();
  parentForm = input<FormGroup>();
  label = input('');
  displayText!: string;
  executeFnForValueSet = input(false);
  fnForValueSet = input<ReturnObservableString>();
  ngOnInit(): void {
    this.displayText = this.acceptTypeText().toUpperCase();
  }

  get control() {
    return this.parentForm()?.get(this.controlName()) as FormControl;
  }

  getFile(e: Event) {
    let input = e.target as HTMLInputElement;
    let files = input.files as FileList;
    this.file.emit(files[0]);
    if (this.executeFnForValueSet()) {
      this.setValueForControl(e);
    }
  }
  setValueForControl(e: Event) {
    let input = e.target as HTMLInputElement;
    let fileList = input.files as FileList;
    (this.fnForValueSet() as ReturnObservableString)(fileList[0]).subscribe({
      next: (res) => {
        this.control.setValue(res);
      },
    });
  }
}
type ReturnObservableString = (e: File) => Observable<string>;
