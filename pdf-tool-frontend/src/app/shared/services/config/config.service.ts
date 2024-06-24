import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  prefix = 'http://localhost:5000';
  apis = {
    default: "/",
    login: "/login",
    user: "/user",
    createUser: "/create-user",
    updateUser: "/update-user",
    pdfList: "/pdf-list",
    pdf: "/pdf",
    createPdf: "/create-pdf",
    updatePdf: "/update-pdf",
    pdfListByUserId : "/pdf-list-by-userId"
  };
}
