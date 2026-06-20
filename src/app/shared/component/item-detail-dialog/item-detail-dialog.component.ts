import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-item-detail-dialog',
  standalone: true,
  imports: [CommonModule,PdfViewerModule],
  templateUrl: './item-detail-dialog.component.html',
  styleUrl: './item-detail-dialog.component.scss'
})
export class ItemDetailDialogComponent {
  @ViewChild("pdfViewer") pdfViewer: PdfViewerComponent;
  constructor(
    public dialogRef: MatDialogRef<ItemDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
  // Method to determine if the URL is an image
  isImageLink(url: string): boolean {
    return url.startsWith('https://');
  }

  // Method to determine if the string is a URL
  isURL(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Method to determine if the Base64 data URI is an image
  isImage(dataUri: string): boolean {
    return dataUri.startsWith('data:image/');
  }

  // Method to determine if the Base64 data URI is a PDF
  isPDF(dataUri: string): boolean {
    // console.log('dataUri.startsWith',dataUri.startsWith('data:application/pdf;'));
    return dataUri.startsWith('data:application/pdf;');
  }
}
