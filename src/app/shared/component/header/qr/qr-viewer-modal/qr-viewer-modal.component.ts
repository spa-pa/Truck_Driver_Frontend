// src/app/components/qr-viewer-modal/qr-viewer-modal.component.ts

import { Component, Input, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { QRDisplayComponent } from '@modules/masters/QR-Operation/qr-code/qr-display/qr-display.component';
import { QRConfig, DEFAULT_QR_CONFIG, QRResponse } from '@shared/models/qr.model';
import { QRConfigService } from '@shared/services/qr-config.service';
import { UrlService } from '@shared/services/url.service';
import { QrConfigService } from '@shared/_http/qr-config.service';


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

  @Input() terminalId: number;
  @Input() qrData: string = '';
  @Input() configData: any = null;

  config: QRConfig;
  response: QRResponse | null = null;
  currentDate = new Date();

  private modalRef: NgbModalRef | null = null;
  private isInitialized = false;

  constructor(
    private modalService: NgbModal,
    private qrConfigService: QRConfigService,
    private urlService: UrlService,
    private qrConfigApiService: QrConfigService,

  ) { }

  ngOnInit(): void {
    this.qrConfigApiService.getQrConfig(1).subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          // Store the full response
          this.config = response.data.json;

          if (this.qrData) {
            this.config.data = this.urlService.getDriverTrainingUrl(this.terminalId);
          }
        } else {
          console.warn('No config found for terminal:', this.terminalId);
          // Use default URL
        }

      },
      error: (err) => {
        console.error('Error loading QR config:', err);
      }
    });
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