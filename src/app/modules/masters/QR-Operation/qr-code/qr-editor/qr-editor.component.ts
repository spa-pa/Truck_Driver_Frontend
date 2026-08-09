// src/app/components/qr-editor/qr-editor.component.ts

import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRDisplayComponent } from '../qr-display/qr-display.component';
import { QRConfig, DEFAULT_QR_CONFIG, QRResponse } from '@shared/models/qr.model';
import { QRConfigService } from '@shared/services/qr-config.service';
import { QrConfigService } from '@shared/_http/qr-config.service';
import { environment } from '@environments/environment';
import { currentUser } from '@shared/utils/current-user';
import { ToastService } from '@shared/services/toast.service';
import { UrlService } from '@shared/services/url.service';

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

  // IDs
  terminalId: number = 0;
  qrConfigId: number = 0;
  isLoading: boolean = false;
  isSaving: boolean = false;
  isDataLoaded: boolean = false;

  // Store original config from API
  originalConfig: any = null;

  constructor(
    private qrConfigService: QRConfigService,
    private cdr: ChangeDetectorRef,
    private qrConfigApiService: QrConfigService,
    private toastService: ToastService,
    private urlService: UrlService
  ) { }

  ngOnInit(): void {
    // Get terminal_id from current user
    this.getTerminalIdFromUser();
  }

  // ============================================
  // GET TERMINAL ID FROM CURRENT USER
  // ============================================

  private getTerminalIdFromUser(): void {
    const user = currentUser();
    if (user && user.terminal_id) {
      this.terminalId = user.terminal_id;
      this.loadQrConfigById(1);
    }
  }

  // ============================================
  // LOAD QR CONFIG BY TERMINAL ID
  // ============================================

  loadQrConfig(terminalId: number): void {
    if (!terminalId) {
      console.warn('No terminal ID provided, loading by config ID 1');
      this.loadQrConfigById(1);
      return;
    }

    this.isLoading = true;
    this.isDataLoaded = false;

    this.qrConfigApiService.getQrConfig(terminalId).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        console.log('API Response:', response);

        if (response && response.success && response.data) {
          this.originalConfig = response.data;

          // Extract qr_config_id
          this.qrConfigId = response.data.qr_config_id || 0;

          // Extract json config
          const jsonConfig = response.data.json || {};

          // Parse data if it's a string
          let parsedData = jsonConfig.data || '';
          try {
            if (typeof parsedData === 'string') {
              // If it's a valid JSON string, parse it
              JSON.parse(parsedData);
            }
          } catch (e) {
            // If not valid JSON, keep as is
          }

          // Update config with API data
          this.config = {
            ...this.config,
            data: parsedData,
            qrColor: jsonConfig.qrColor || this.config.qrColor,
            bgColor: jsonConfig.bgColor || this.config.bgColor,
            qrSize: jsonConfig.qrSize || this.config.qrSize,
            dotType: jsonConfig.dotType || this.config.dotType,
            logoUrl: jsonConfig.logoUrl || this.config.logoUrl,
            bottomText: jsonConfig.bottomText || this.config.bottomText,
            textSize: jsonConfig.textSize || this.config.textSize,
            textColor: jsonConfig.textColor || this.config.textColor,
            fontFamily: jsonConfig.fontFamily || this.config.fontFamily,
            fontWeight: jsonConfig.fontWeight || this.config.fontWeight,
            terminalId: jsonConfig.terminalId || this.terminalId
          };

          // If no data, generate URL
          if (!this.config.data || this.config.data === '') {
            this.config.data = this.generateUrl(this.terminalId);
          }

          // Update service
          this.qrConfigService.updateConfig(this.config);
          this.isDataLoaded = true;

          // Regenerate QR
          setTimeout(() => {
            if (this.qrDisplay) {
              this.qrDisplay.generateQR();
            }
          }, 100);

        } else {
          console.warn('No config found for terminal:', terminalId);
          this.initializeDefaultConfig(terminalId);
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading QR config:', err);
        this.isLoading = false;
        this.isDataLoaded = true;
        this.initializeDefaultConfig(terminalId);
        this.cdr.detectChanges();
      }
    });
  }

  // ============================================
  // LOAD QR CONFIG BY CONFIG ID (Fallback)
  // ============================================

  loadQrConfigById(configId: number): void {
    this.isLoading = true;
    this.isDataLoaded = false;

    this.qrConfigApiService.getQrConfig(configId).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        console.log('API Response by ID:', response);

        if (response && response.success && response.data) {
          this.originalConfig = response.data;

          // Extract qr_config_id
          this.qrConfigId = response.data.qr_config_id || configId;

          // Extract json config
          const jsonConfig = response.data.json || {};

          // Parse data if it's a string
          let parsedData = jsonConfig.data || '';
          try {
            if (typeof parsedData === 'string') {
              JSON.parse(parsedData);
            }
          } catch (e) {
            // If not valid JSON, keep as is
          }

          // Update config with API data
          this.config = {
            ...this.config,
            data: this.generateUrl(this.terminalId),
            qrColor: jsonConfig.qrColor || this.config.qrColor,
            bgColor: jsonConfig.bgColor || this.config.bgColor,
            qrSize: jsonConfig.qrSize || this.config.qrSize,
            dotType: jsonConfig.dotType || this.config.dotType,
            logoUrl: jsonConfig.logoUrl || this.config.logoUrl,
            bottomText: jsonConfig.bottomText || this.config.bottomText,
            textSize: jsonConfig.textSize || this.config.textSize,
            textColor: jsonConfig.textColor || this.config.textColor,
            fontFamily: jsonConfig.fontFamily || this.config.fontFamily,
            fontWeight: jsonConfig.fontWeight || this.config.fontWeight,
            terminalId: jsonConfig.terminalId || this.terminalId
          };

          // If no data, generate URL
          if (!this.config.data || this.config.data === '') {
            this.config.data = this.generateUrl(this.terminalId || 0);
          }

          // Update service
          this.qrConfigService.updateConfig(this.config);
          this.isDataLoaded = true;

          // Regenerate QR
          setTimeout(() => {
            if (this.qrDisplay) {
              this.qrDisplay.generateQR();
            }
          }, 100);

        } else {
          console.warn('No config found for ID:', configId);
          this.initializeDefaultConfig(0);
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading QR config by ID:', err);
        this.isLoading = false;
        this.isDataLoaded = true;
        this.initializeDefaultConfig(0);
        this.cdr.detectChanges();
      }
    });
  }

  // ============================================
  // INITIALIZE DEFAULT CONFIG
  // ============================================

  private initializeDefaultConfig(terminalId: number): void {
    const url = this.generateUrl(terminalId || this.terminalId);

    // Create default config with URL
    const defaultConfig = {
      ...DEFAULT_QR_CONFIG,
      data: url,
      terminalId: terminalId || this.terminalId || 0,
      bottomText: `Terminal ${terminalId || this.terminalId || 0}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.config = defaultConfig;
    this.qrConfigService.updateConfig(this.config);

    setTimeout(() => {
      if (this.qrDisplay) {
        this.qrDisplay.generateQR();
      }
    }, 100);
  }

  // ============================================
  // SAVE QR CONFIG TO BACKEND
  // ============================================

  saveQrConfig(): void {
    this.isSaving = true;

    // Prepare payload with all required fields
    const payload = {
      json: {
        data: this.config.data,
        qrColor: this.config.qrColor,
        bgColor: this.config.bgColor,
        qrSize: this.config.qrSize,
        dotType: this.config.dotType,
        logoUrl: this.config.logoUrl,
        bottomText: this.config.bottomText,
        textSize: this.config.textSize,
        textColor: this.config.textColor,
        fontFamily: this.config.fontFamily,
        fontWeight: this.config.fontWeight,
        terminalId: this.terminalId,
        createdAt: this.config.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    // If we have a qr_config_id, update by ID
    // if (this.qrConfigId) {
    this.qrConfigApiService.updateQrConfig(payload, 1).subscribe({
      next: (response: any) => {
        this.isSaving = false;

        this.toastService.open('Configuration saved successfully!', 'success')
        if (response && response.data) {
          this.originalConfig = response.data;
          if (response.data.qr_config_id) {
            this.qrConfigId = response.data.qr_config_id;
          }
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error saving QR config:', err);
        this.isSaving = false;
        alert('Failed to save configuration. Please try again.');
        this.cdr.detectChanges();
      }
    });
    // }
  }

  // ============================================
  // GENERATE URL FROM ENVIRONMENT
  // ============================================

  private generateUrl(terminalId: number): string {
    const baseUrl = environment.SACNNING_BASE_URL || 'http://localhost:4200';
    // return `${baseUrl}/safety-training?terminalId=${terminalId}`;
    return this.urlService.getDriverTrainingUrl(this.terminalId);
  }

  // ============================================
  // UPDATE CONFIG
  // ============================================

  updateConfig(): void {
    this.qrConfigService.updateConfig(this.config);
    setTimeout(() => {
      if (this.qrDisplay) {
        this.qrDisplay.generateQR();
      }
    }, 100);
  }

  // ============================================
  // REFRESH FROM API
  // ============================================

  refreshFromApi(): void {
    if (this.qrConfigId) {
      this.loadQrConfigById(this.qrConfigId);
    } else if (this.terminalId) {
      this.loadQrConfig(this.terminalId);
    } else {
      this.getTerminalIdFromUser();
    }
  }

  // ============================================
  // OTHER METHODS
  // ============================================

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
          this.qrDisplay.generateQR();
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
        this.qrDisplay.generateQR();
      }
    }, 100);
  }

  resetConfig(): void {
    if (confirm('Reset all configurations?')) {
      const resetConfig = { ...DEFAULT_QR_CONFIG };
      resetConfig.terminalId = this.terminalId;
      resetConfig.data = this.generateUrl(this.terminalId);

      this.config = resetConfig;
      this.qrConfigService.updateConfig(this.config);

      setTimeout(() => {
        if (this.qrDisplay) {
          this.qrDisplay.generateQR();
        }
      }, 100);
    }
  }

  exportConfig(): void {
    const configJson = this.qrConfigService.exportConfig();
    console.log('configJson = ', configJson);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qr-config-${this.qrConfigId || this.terminalId}.json`;
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
        if (this.config.terminalId) {
          this.terminalId = this.config.terminalId;
        }
        setTimeout(() => {
          if (this.qrDisplay) {
            this.qrDisplay.generateQR();
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

  // ============================================
  // DOWNLOAD METHODS
  // ============================================

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