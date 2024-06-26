import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormElements } from '../shared/components/form-elements/form_elements';
import { ApiService } from '../shared/services/api/api.service';
import { LocalStorageService } from '../shared/services/local-storage/local-storage.service';
import { PDF } from '../shared/models/pdf';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { Router } from '@angular/router';
const PdfManagementImports = [FormElements, DatePipe];
@Component({
  selector: 'pdf-management',
  standalone: true,
  imports: [PdfManagementImports],
  templateUrl: './pdf-management.component.html',
  styleUrl: './pdf-management.component.scss',
})
export class PdfManagementComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private storage = inject(LocalStorageService);
  private router = inject(Router)
  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    fileName: ['', Validators.required],
    userId: this.storage.getUserId(),
  });

  ngOnInit(): void {
    this.getUploadedPDFs();
  }

  pdfList!: PDF[];
  getUploadedPDFs() {
    let userId = this.storage.getUserId();
    this.apiService.pdfListByUserId(userId).subscribe({
      next: (res) => {
        this.pdfList = res;
      },
    });
  }

  uploadFile = (e: File) => {
    let formData = new FormData();
    formData.append('file', e);
    return this.apiService
      .uploadFile(formData)
      .pipe(map((res) => res['fileName'] as string));
  };

  upload() {
    let pdfEntry = this.form.value as PDF;
    this.apiService.createPdfEntry(pdfEntry).subscribe({
      next: (res) => {
        this.getUploadedPDFs();
      },
    });
  }

  gotoPdf(id: string){
    this.router.navigate(['view',id])
  }
}
