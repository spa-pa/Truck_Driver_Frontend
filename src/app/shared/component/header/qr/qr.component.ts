// src/app/components/qr/qr.component.ts

import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { TooltipModule } from "primeng/tooltip";
import { QRViewerModalComponent } from './qr-viewer-modal/qr-viewer-modal.component';
import { UrlService } from '@shared/services/url.service';
import { QrConfigService } from '@shared/_http/qr-config.service';
import { currentUser } from '@shared/utils/current-user';
import { QRConfig, DEFAULT_QR_CONFIG } from '@shared/models/qr.model';
import { TerminalService } from '@shared/_http/terminal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qr',
  imports: [TooltipModule, QRViewerModalComponent],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.scss'
})
export class QrComponent implements OnInit {

  @ViewChild('qrModal') qrModal!: QRViewerModalComponent;

  qrDataString: string = '';
  terminalId: number = 0;
  qrConfig: any = null;
  isLoading: boolean = false;
  config: QRConfig = { ...DEFAULT_QR_CONFIG };

  subs: any;
  constructor(
    private urlService: UrlService,
    private qrConfigApiService: QrConfigService,
    public cdr: ChangeDetectorRef,
    private terminalService: TerminalService
  ) { }

  ngOnInit(): void {
    this.subs = new Subscription();
    this.getTerminalIdFromUser();
  }

  // ============================================
  // GET TERMINAL ID FROM CURRENT USER
  // ============================================

  private getTerminalIdFromUser(): void {
    const user = currentUser();
    if (user && user.terminal_id) {
      this.terminalId = user.terminal_id;
    }
    this.loadQrConfig(this.terminalId);

  }

  // ============================================
  // LOAD QR CONFIG FROM API
  // ============================================

  loadQrConfig(terminalId: number): void {
    if (!terminalId) {
      console.warn('No terminal ID provided');
      return;
    }

    this.isLoading = true;

    this.qrConfigApiService.getQrConfig(1).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.success && response.data) {
          // Store the full response
          this.qrConfig = response.data.json;

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
            qrColor: jsonConfig.qrColor || this.qrConfig.qrColor,
            bgColor: jsonConfig.bgColor || this.qrConfig.bgColor,
            qrSize: jsonConfig.qrSize || this.qrConfig.qrSize,
            dotType: jsonConfig.dotType || this.qrConfig.dotType,
            logoUrl: jsonConfig.logoUrl || this.qrConfig.logoUrl,
            bottomText: jsonConfig.bottomText || this.qrConfig.bottomText,
            textSize: jsonConfig.textSize || this.qrConfig.textSize,
            textColor: jsonConfig.textColor || this.qrConfig.textColor,
            fontFamily: jsonConfig.fontFamily || this.qrConfig.fontFamily,
            fontWeight: jsonConfig.fontWeight || this.qrConfig.fontWeight,
            terminalId: jsonConfig.terminalId || this.terminalId
          };

          // Set QR data string - use URL from config or generate from terminalId
          if (this.config.data && this.config.data !== '') {
            this.qrDataString = this.config.data;
          } else {
            this.qrDataString = this.urlService.getDriverTrainingUrl(this.terminalId);
          }

          // Update the modal with the config data
          if (this.qrModal) {
            this.qrModal.configData = this.config;
            this.qrModal.terminalId = this.terminalId;
            this.qrModal.qrData = this.qrDataString;
          }

        } else {
          console.warn('No config found for terminal:', terminalId);
          // Use default URL
          this.qrDataString = this.urlService.getDriverTrainingUrl(this.terminalId);
        }

        this.cdr?.detectChanges();
      },
      error: (err) => {
        console.error('Error loading QR config:', err);
        this.isLoading = false;
        // Use default URL on error
        this.qrDataString = this.urlService.getDriverTrainingUrl(this.terminalId);
        this.cdr?.detectChanges();
      }
    });
  }

  // ============================================
  // OPEN QR MODAL
  // ============================================

  qRcode(): void {
    this.openQRModal();
  }

  openQRModal(): void {
    if (this.qrModal) {
      // Get the latest terminal ID from user
      const user = currentUser();
      if (user && user.terminal_id) {
        this.terminalId = user.terminal_id;
      }

      // Set data for modal
      this.qrModal.qrData = this.qrDataString || this.urlService.getDriverTrainingUrl(this.terminalId);
      this.qrModal.terminalId = this.terminalId;

      // If config is loaded, pass it to modal
      if (this.config) {
        this.qrModal.configData = this.config;
      }

      this.qrModal.openModal();
    }
  }

  // ============================================
  // REFRESH QR CONFIG
  // ============================================

  refreshQrConfig(): void {
    if (this.terminalId) {
      this.loadQrConfig(this.terminalId);
    } else {
      this.getTerminalIdFromUser();
    }
  }

  // ============================================
  // OPEN SCANNER
  // ============================================

  openScanner(): void {
    // Implement scanner logic here
  }
}