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

  createUser(user : User) {
    let url = `${this.config.prefix}${this.config.apis.createUser}`
    return this.http.post<ApiResponse>(url, user)
  }

  login(user : User){
    let url = `${this.config.prefix}${this.config.apis.login}`
    return this.http.post<ApiResponse>(url, user)
  }

  uploadFile(formData : FormData){
    let url = ''
    return this.http.post<ApiResponse>(url, formData)
  }

  bookById(id : string){
    let url = ''
    return this.http.get(url)
  }

  createPdfEntry(pdf : PDF){
    let url = ''
    return this.http.post<ApiResponse>(url, pdf)
  }

  pdfListByUserId(userId : string){
    let url = `${this.config.prefix}${this.config.apis.pdfListByUserId}?id=${userId}`
    return this.http.get<PDF[]>(url)
  }

}
