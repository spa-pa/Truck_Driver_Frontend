// src/app/components/qr-scanner-modal/qr-scanner-modal.component.ts

import { Component, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { QRScannerComponent } from '@modules/masters/QR-Operation/qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-qr-scanner-modal',
  standalone: true,
  imports: [CommonModule, NgbModalModule, QRScannerComponent],
  templateUrl: './qr-scanner-modal.component.html',
  styleUrls: ['./qr-scanner-modal.component.scss']
})
export class QRScannerModalComponent {
  @ViewChild('qrscanModal') qrscanModal!: TemplateRef<any>;
  @Output() scanComplete = new EventEmitter<any>();

  // backendUrl: string = 'https://your-backend-api.com/scan';
  private modalRef: NgbModalRef | null = null;

  constructor(private modalService: NgbModal) { }

  openModal(): void {
    if (this.modalRef) {
      return;
    }

    this.modalRef = this.modalService.open(this.qrscanModal, {
      centered: true,
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'qr-scanner-modal-window'
    });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  onScanComplete(data: any): void {
    this.scanComplete.emit(data);
    setTimeout(() => {
      this.closeModal();
    }, 1500);
  }
}