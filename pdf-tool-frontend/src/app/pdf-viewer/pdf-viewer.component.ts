import {
  Component,
  Input,
  Signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api/api.service';
import {
  EditorAnnotation,
  InkEditorAnnotation,
  NgxExtendedPdfViewerComponent,
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
  PdfSidebarView,
} from 'ngx-extended-pdf-viewer';
import { AnnotationEditorEvent } from 'ngx-extended-pdf-viewer/lib/events/annotation-editor-layer-event';
import { PDF } from '../shared/models/pdf';
import { NavService } from '../navigation/nav-service/nav-service.service';
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
  private pdfService = inject(NgxExtendedPdfViewerService);
  private navService = inject(NavService);
  ngOnInit(): void {
    let toolsNeeded = {
      ...this.navService.tools,
      saveButton: true,
      backButton: true,
    };
    this.navService.setNavBarTools(toolsNeeded);
    this.getBookById();
    this.navService.savePdfAnnotations.subscribe({
      next: (res) => {
        if (res) {
          this.save();
        }
      },
    });
  }

  src = signal<string>('') as WritableSignal<string>;
  isSrcPresent = signal(false);
  pdf!: PDF;
  getBookById() {
    this.apiService.pdfById(this.id).subscribe({
      next: (res) => {
        let fileName = res.fileName;
        this.pdf = res;
        this.src.update(() => this.apiService.getPdfUrl(fileName));
        this.isSrcPresent.update((p) => !p);
        setTimeout(() => {
          if(res.data){
            if(res.data.length != 0){
              this.addAnnotations(res.data);
            }
          }
        }, 1000);
      },
    });
  }

  save() {
    this.pdf = {
      ...this.pdf,
      data: this.pdfService.getSerializedAnnotations(),
    };
    this.apiService.updatePdf(this.pdf).subscribe({
      next: (res) => {
        this.navService.setSaveState('Saved');
      },
      error: (err) => {
        this.navService.setSaveState('Error');
      },
      complete: () => {
        this.navService.savePdfAnnotations.next(false);
      },
    });
  }

  addAnnotations(serialAnnotations: EditorAnnotation[]) {
    console.log(serialAnnotations);
    for (let ann of serialAnnotations) {
      this.pdfService.addEditorAnnotation(ann);
    }
  }

  ngOnDestroy(): void {
    this.navService.setNavBarTools(this.navService.tools);
  }
}
