import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { ApiResponse } from '../../models/apiResponse';
import { PDF } from '../../models/pdf';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private config = inject(ConfigService);
  private http = inject(HttpClient);

  createUser(user: User) {
    let url = `${this.config.prefix}${this.config.apis.createUser}`;
    return this.http.post<ApiResponse>(url, user);
  }

  login(user: User) {
    let url = `${this.config.prefix}${this.config.apis.login}`;
    return this.http.post<ApiResponse>(url, user);
  }

  uploadFile(formData: FormData) {
    let url = `${this.config.prefix}${this.config.apis.uploadPdf}`;
    return this.http.post<ApiResponse>(url, formData);
  }

  createPdfEntry(pdf: PDF) {
    let url = `${this.config.prefix}${this.config.apis.createPdf}`;
    return this.http.post<ApiResponse>(url, pdf);
  }

  pdfListByUserId(userId: string) {
    let url = `${this.config.prefix}${this.config.apis.pdfListByUserId}?id=${userId}`;
    return this.http.get<PDF[]>(url);
  }

  pdfById(id: string){
    let url = `${this.config.prefix}${this.config.apis.pdf}?id=${id}`
    return this.http.get<PDF>(url)
  }

  getPdfUrl(fileName : string){
    return `${this.config.prefix}${this.config.apis.downloadPdf}?fileName=${fileName}`
  }

  updatePdf(pdf : PDF){
    let url = `${this.config.prefix}${this.config.apis.updatePdf}`
    return this.http.put(url, pdf)
  }
}
