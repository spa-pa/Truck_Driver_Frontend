// src/app/components/qr-viewer-modal/qr-viewer-modal.component.ts

import { Component, Input, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { QRDisplayComponent } from '@modules/masters/QR-Operation/qr-code/qr-display/qr-display.component';
import { QRConfig, DEFAULT_QR_CONFIG, QRResponse } from '@shared/models/qr.model';
import { QRConfigService } from '@shared/services/qr-config.service';


@Component({
  selector: 'app-qr-viewer-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgbModalModule,
    QRDisplayComponent
  ],
  templateUrl: './qr-viewer-modal.component.html',
  styleUrls: ['./qr-viewer-modal.component.scss']
})
export class QRViewerModalComponent implements OnInit, AfterViewInit {
  @ViewChild('qrModal') qrModal!: TemplateRef<any>;
  @ViewChild('qrDisplay') qrDisplay!: QRDisplayComponent;

  @Input() terminalId: number = 123;
  @Input() qrData: string = '';
  @Input() configData: any = null;

  config: QRConfig = { ...DEFAULT_QR_CONFIG };
  response: QRResponse | null = null;
  currentDate = new Date();

  private modalRef: NgbModalRef | null = null;
  private isInitialized = false;

  constructor(
    private modalService: NgbModal,
    private qrConfigService: QRConfigService
  ) { }

  ngOnInit(): void {
    // Subscribe to config changes
    this.qrConfigService.config$.subscribe(config => {
      this.config = { ...config };
      if (this.isInitialized && this.qrDisplay) {
        setTimeout(() => {
          this.qrDisplay.generateQR();
        }, 100);
      }
    });

    this.qrConfigService.response$.subscribe(response => {
      this.response = response;
    });

    // Set initial data if provided
    if (this.terminalId) {
      this.config.terminalId = this.terminalId;
    }

    if (this.qrData) {
      try {
        JSON.parse(this.qrData);
        this.config.data = this.qrData;
      } catch (e) {
        // Keep as is
      }
    }

    // If configData is provided, use it
    if (this.configData) {
      this.config = { ...this.config, ...this.configData };
    }
  }

  ngAfterViewInit(): void {
    this.isInitialized = true;
  }

  // ============ MODAL METHODS ============

  /**
   * Open the QR modal
   */
  openModal(): void {
    if (this.modalRef) {
      return;
    }

    this.modalRef = this.modalService.open(this.qrModal, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'qr-viewer-modal-window'
    });

    // Regenerate QR when modal is opened
    setTimeout(() => {
      if (this.qrDisplay) {
        this.qrDisplay.generateQR();
      }
    }, 300);
  }

  /**
   * Close the modal
   */
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  // ============ GETTERS ============

  getResponseJSON(): string {
    return this.response ? JSON.stringify(this.response, null, 4) : '{}';
  }

  // ============ DOWNLOAD METHODS ============

  async downloadPNG(): Promise<void> {
    if (!this.qrDisplay) return;
    try {
      await this.qrDisplay.downloadPNG();
    } catch (error) {
      console.error('PNG download error:', error);
    }
  }

  async downloadJPG(): Promise<void> {
    if (!this.qrDisplay) return;
    try {
      await this.qrDisplay.downloadJPG();
    } catch (error) {
      console.error('JPG download error:', error);
    }
  }

  async downloadPDF(): Promise<void> {
    if (!this.qrDisplay) return;
    try {
      await this.qrDisplay.downloadPDF();
    } catch (error) {
      console.error('PDF download error:', error);
    }
  }

  async downloadSVG(): Promise<void> {
    if (!this.qrDisplay) return;
    try {
      await this.qrDisplay.downloadSVG();
    } catch (error) {
      console.error('SVG download error:', error);
    }
  }

  async printQR(): Promise<void> {
    if (!this.qrDisplay) return;
    try {
      await this.qrDisplay.print();
    } catch (error) {
      console.error('Print error:', error);
    }
  }

  async copyQR(): Promise<void> {
    if (!this.qrDisplay) return;
    try {
      await this.qrDisplay.copyToClipboard();
      // Show success feedback
    } catch (error) {
      console.error('Copy error:', error);
    }
  }
}