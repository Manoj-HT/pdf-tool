import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api/api.service';

@Component({
  selector: 'pdf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent {
  private router = inject(Router);
  private apiService = inject(ApiService);
  id = this.router.url.split('/')[1];
  
  ngOnInit(): void {
    this.getBookById()
  }

  getBookById() {
    this.apiService.bookById(this.id).subscribe({
      next : (res) => {
        
      }
    })
  }
  
}
