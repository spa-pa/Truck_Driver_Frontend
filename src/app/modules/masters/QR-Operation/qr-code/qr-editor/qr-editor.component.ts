// src/app/components/qr-editor/qr-editor.component.ts

import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRDisplayComponent } from '../qr-display/qr-display.component';
import { QRConfig, DEFAULT_QR_CONFIG, QRResponse } from '@shared/models/qr.model';
import { QRConfigService } from '@shared/services/qr-config.service';

@Component({
  selector: 'app-qr-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QRDisplayComponent],
  templateUrl: './qr-editor.component.html',
  styleUrls: ['./qr-editor.component.scss']
})
export class QREditorComponent implements OnInit {
  @ViewChild('qrDisplay') qrDisplay!: QRDisplayComponent;

  config: QRConfig = { ...DEFAULT_QR_CONFIG };
  response: QRResponse | null = null;
  isDownloading: boolean = false;
  downloadProgress: string = '';

  constructor(
    private qrConfigService: QRConfigService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.qrConfigService.config$.subscribe(config => {
      this.config = { ...config };
      this.cdr.detectChanges();
    });

    this.qrConfigService.response$.subscribe(response => {
      this.response = response;
    });
  }

  updateConfig(): void {
    this.qrConfigService.updateConfig(this.config);
    setTimeout(() => {
      if (this.qrDisplay) {
        this.qrDisplay.generateQR(); // Now public and accessible
      }
    }, 100);
  }

  formatJSON(): void {
    try {
      const parsed = JSON.parse(this.config.data);
      this.config.data = JSON.stringify(parsed, null, 2);
      this.updateConfig();
    } catch (e) {
      // Keep as is
    }
  }

  onLogoUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.config.logoUrl = e.target.result;
      this.updateConfig();
      setTimeout(() => {
        if (this.qrDisplay) {
          this.qrDisplay.generateQR(); // Now public and accessible
        }
      }, 200);
    };
    reader.readAsDataURL(file);
  }

  removeLogo(): void {
    this.config.logoUrl = '';
    this.updateConfig();
    setTimeout(() => {
      if (this.qrDisplay) {
        this.qrDisplay.generateQR(); // Now public and accessible
      }
    }, 100);
  }

  resetConfig(): void {
    if (confirm('Reset all configurations?')) {
      this.qrConfigService.resetConfig();
      setTimeout(() => {
        if (this.qrDisplay) {
          this.qrDisplay.generateQR(); // Now public and accessible
        }
      }, 100);
    }
  }

  exportConfig(): void {
    const configJson = this.qrConfigService.exportConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qr-config-${this.config.terminalId}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  importConfig(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const success = this.qrConfigService.importConfig(e.target.result);
      if (success) {
        alert('Configuration imported successfully!');
        setTimeout(() => {
          if (this.qrDisplay) {
            this.qrDisplay.generateQR(); // Now public and accessible
          }
        }, 100);
      } else {
        alert('Invalid configuration file.');
      }
    };
    reader.readAsText(file);
  }

  getResponseJSON(): string {
    return this.response ? JSON.stringify(this.response, null, 4) : '{}';
  }

  // Download methods
  async downloadPNG(): Promise<void> {
    if (!this.qrDisplay) {
      alert('QR code not ready. Please wait.');
      return;
    }

    this.isDownloading = true;
    this.downloadProgress = 'Generating PNG...';

    try {
      await this.qrDisplay.downloadPNG();
      this.downloadProgress = 'PNG downloaded successfully!';
      setTimeout(() => this.downloadProgress = '', 2000);
    } catch (error) {
      console.error('PNG download error:', error);
      this.downloadProgress = 'Error downloading PNG';
      alert('Failed to download PNG. Please try again.');
    } finally {
      this.isDownloading = false;
    }
  }

  async downloadJPG(): Promise<void> {
    if (!this.qrDisplay) {
      alert('QR code not ready. Please wait.');
      return;
    }

    this.isDownloading = true;
    this.downloadProgress = 'Generating JPG...';

    try {
      await this.qrDisplay.downloadJPG();
      this.downloadProgress = 'JPG downloaded successfully!';
      setTimeout(() => this.downloadProgress = '', 2000);
    } catch (error) {
      console.error('JPG download error:', error);
      this.downloadProgress = 'Error downloading JPG';
      alert('Failed to download JPG. Please try again.');
    } finally {
      this.isDownloading = false;
    }
  }

  async downloadPDF(): Promise<void> {
    if (!this.qrDisplay) {
      alert('QR code not ready. Please wait.');
      return;
    }

    this.isDownloading = true;
    this.downloadProgress = 'Generating PDF...';

    try {
      await this.qrDisplay.downloadPDF();
      this.downloadProgress = 'PDF downloaded successfully!';
      setTimeout(() => this.downloadProgress = '', 2000);
    } catch (error) {
      console.error('PDF download error:', error);
      this.downloadProgress = 'Error downloading PDF';
      alert('Failed to download PDF. Please try again.');
    } finally {
      this.isDownloading = false;
    }
  }

  async downloadSVG(): Promise<void> {
    if (!this.qrDisplay) {
      alert('QR code not ready. Please wait.');
      return;
    }

    this.isDownloading = true;
    this.downloadProgress = 'Generating SVG...';

    try {
      await this.qrDisplay.downloadSVG();
      this.downloadProgress = 'SVG downloaded successfully!';
      setTimeout(() => this.downloadProgress = '', 2000);
    } catch (error) {
      console.error('SVG download error:', error);
      this.downloadProgress = 'Error downloading SVG';
      alert('Failed to download SVG. Please try again.');
    } finally {
      this.isDownloading = false;
    }
  }

  async printQR(): Promise<void> {
    if (!this.qrDisplay) {
      alert('QR code not ready. Please wait.');
      return;
    }

    try {
      await this.qrDisplay.print();
    } catch (error) {
      console.error('Print error:', error);
      alert('Failed to print. Please try again.');
    }
  }

  async copyQRToClipboard(): Promise<void> {
    if (!this.qrDisplay) {
      alert('QR code not ready. Please wait.');
      return;
    }

    try {
      await this.qrDisplay.copyToClipboard();
      alert('QR code copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      alert('Failed to copy QR code. Please try again.');
    }
  }
}