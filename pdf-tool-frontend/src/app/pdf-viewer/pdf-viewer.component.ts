import {
  Component,
  Input,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api/api.service';
import {
  AnnotationEditorLayerRenderedEvent,
  NgxExtendedPdfViewerComponent,
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
  PdfSidebarView,
} from 'ngx-extended-pdf-viewer';
const PdfViewerImports = [NgxExtendedPdfViewerModule];
@Component({
  selector: 'pdf-viewer',
  standalone: true,
  imports: [PdfViewerImports],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent {
  private router = inject(Router);
  private apiService = inject(ApiService);
  id = this.router.url.split('/')[2];
  pdfService = inject(NgxExtendedPdfViewerService);
  ngOnInit(): void {
    this.getBookById();
  }

  src = signal<string>('') as WritableSignal<string>;
  isSrcPresent = signal(false);
  getBookById() {
    this.apiService.pdfById(this.id).subscribe({
      next: (res) => {
        let fileName = res.fileName;
        this.src.update(() => this.apiService.getPdfUrl(fileName));
        this.isSrcPresent.update((p) => !p);
      },
    });
  }

  activeSidebarViewChange(e: PdfSidebarView) {
    console.log(e);
  }

  onAnnotationLayerRendered(e: AnnotationEditorLayerRenderedEvent) {
    console.log(e);
  }
}
