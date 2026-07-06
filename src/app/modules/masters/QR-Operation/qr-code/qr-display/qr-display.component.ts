// src/app/components/qr-display/qr-display.component.ts

import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRConfig } from '@shared/models/qr.model';
import { environment } from '@environments/environment.prod';

@Component({
  selector: 'app-qr-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="qr-display-wrapper" #qrDisplayWrapper>
      <div class="qr-display-container" [class]="'size-' + size">
        <div class="qr-wrapper" #qrWrapper>
          <div class="qr-frame" [style.border-color]="config.qrColor">
            <div #qrElement class="qr-element-container"></div>
          </div>
          <div 
            class="qr-text" 
            *ngIf="config.bottomText && showText"
            [style.font-size.px]="config.textSize"
            [style.color]="config.textColor"
            [style.font-family]="config.fontFamily"
            [style.font-weight]="config.fontWeight"
          >
            {{ config.bottomText }}
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./qr-display.component.scss']
})
export class QRDisplayComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() config!: QRConfig;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showText: boolean = true;
  @Input() showBorder: boolean = true;
  @Input() backgroundColor: string = '#ffffff';
  @Output() qrGenerated = new EventEmitter<void>();

  @ViewChild('qrElement') qrElement!: ElementRef;
  @ViewChild('qrWrapper') qrWrapper!: ElementRef;
  @ViewChild('qrDisplayWrapper') qrDisplayWrapper!: ElementRef;

  private qrCode!: QRCodeStyling;
  private isInitialized = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.generateQR();
      this.isInitialized = true;
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // IMPORTANT: Regenerate QR when config changes
    if (this.isInitialized && changes['config']) {
      setTimeout(() => {
        this.generateQR();
      }, 50);
    }

    // Regenerate when size changes
    if (this.isInitialized && changes['size']) {
      setTimeout(() => {
        this.generateQR();
      }, 50);
    }
  }

  ngOnDestroy(): void {
    if (this.qrCode) {
      const element = this.qrElement?.nativeElement;
      if (element) {
        element.innerHTML = '';
      }
      this.qrCode = null as any;
    }
  }

  // ============ PUBLIC METHODS ============

  public generateQR(): void {
    if (!this.qrElement) {
      console.warn('QR element not ready');
      return;
    }

    try {
      const element = this.qrElement.nativeElement;
      // Get the size based on config.qrSize
      const size = this.config.qrSize || this.getSize();
      const { cornerType, cornerDotType } = this.getCornerStyles();

      // let qrData = this.config.data || ' ';
      // Generate QR data - use URL or custom data
      let qrData = this.generateQRData();


      // Validate JSON
      try {
        JSON.parse(qrData);
      } catch (e) {
        // Keep as string if not valid JSON
      }

      const qrOptions: any = {
        width: size,
        height: size,
        data: qrData,
        margin: 10,
        dotsOptions: {
          color: this.config.qrColor || '#004761',
          type: this.config.dotType || 'rounded'
        },
        backgroundOptions: {
          color: this.config.bgColor || '#ffffff'
        },
        cornersSquareOptions: {
          type: cornerType
        },
        cornersDotOptions: {
          type: cornerDotType
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 5,
          imageSize: 0.25
        }
      };

      // Add logo if present
      if (this.config.logoUrl && this.config.logoUrl.trim() !== '') {
        qrOptions.image = this.config.logoUrl;
      }

      // Clear and regenerate
      element.innerHTML = '';
      this.qrCode = new QRCodeStyling(qrOptions);
      this.qrCode.append(element);

      this.centerLogo();
      this.qrGenerated.emit();

    } catch (error) {
      console.error('QR Generation Error:', error);
      const element = this.qrElement.nativeElement;
      element.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:${this.config.qrSize || 250}px;color:#d32f2f;font-size:14px;">
          Error generating QR code
        </div>
      `;
    }
  }

  private generateQRData(): string {
    // Get base URL from environment
    const baseUrl = environment.SACNNING_BASE_URL || 'http://localhost:4200';

    // If custom data is provided, use it
    if (this.config.data && this.config.data !== ' ') {
      return this.config.data;
    }

    // Generate the full URL for driver-training
    const url = `${baseUrl}/driver-training`;

    console.log('QR Code URL:', url); // For debugging

    return url;
  }

  private getSize(): number {
    switch (this.size) {
      case 'small': return 180;
      case 'large': return 350;
      default: return 250;
    }
  }

  private getCornerStyles(): { cornerType: string; cornerDotType: string } {
    const dotType = this.config.dotType;

    switch (dotType) {
      case 'rounded':
        return { cornerType: 'extra-rounded', cornerDotType: 'dot' };
      case 'extra-rounded':
        return { cornerType: 'extra-rounded', cornerDotType: 'dot' };
      case 'dots':
        return { cornerType: 'dot', cornerDotType: 'dot' };
      case 'classy':
        return { cornerType: 'classy', cornerDotType: 'classy' };
      case 'classy-rounded':
        return { cornerType: 'classy-rounded', cornerDotType: 'classy-rounded' };
      default:
        return { cornerType: 'square', cornerDotType: 'square' };
    }
  }

  private centerLogo(): void {
    setTimeout(() => {
      const element = this.qrElement?.nativeElement;
      if (!element) return;

      const logo = element.querySelector('img[src*="data:image"]');
      if (logo) {
        (logo as HTMLElement).style.display = 'block';
        (logo as HTMLElement).style.margin = '0 auto';
      }

      const canvas = element.querySelector('canvas');
      if (canvas) {
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
      }
    }, 200);
  }

  // Download methods
  public async downloadPNG(): Promise<void> {
    try {
      const canvas = await this.captureQR();
      if (!canvas) return;

      const link = document.createElement('a');
      link.download = `qr-code-${this.config.terminalId || 'terminal'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('PNG download error:', error);
      throw error;
    }
  }

  public async downloadJPG(): Promise<void> {
    try {
      const canvas = await this.captureQR();
      if (!canvas) return;

      const link = document.createElement('a');
      link.download = `qr-code-${this.config.terminalId || 'terminal'}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (error) {
      console.error('JPG download error:', error);
      throw error;
    }
  }

  public async downloadPDF(): Promise<void> {
    try {
      const canvas = await this.captureQR();
      if (!canvas) return;

      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const padding = 40;
      const maxWidth = pageWidth - padding;
      const maxHeight = pageHeight - padding;

      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;

      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      pdf.setFontSize(8);
      pdf.setTextColor('#004761');
      pdf.text(`Terminal ID: ${this.config.terminalId || 'N/A'}`, 20, 20);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);

      pdf.addImage(imageData, 'PNG', x, y, width, height);

      const footerText = this.config.bottomText || 'Scan to Connect';
      pdf.setFontSize(10);
      pdf.setTextColor('#004761');
      pdf.text(footerText, pageWidth / 2, pageHeight - 20, { align: 'center' });

      pdf.save(`qr-code-${this.config.terminalId || 'terminal'}.pdf`);
    } catch (error) {
      console.error('PDF download error:', error);
      throw error;
    }
  }

  public async downloadSVG(): Promise<void> {
    try {
      const canvas = await this.captureQR();
      if (!canvas) return;

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              <img src="${canvas.toDataURL('image/png')}" width="${canvas.width}" height="${canvas.height}" />
            </div>
          </foreignObject>
        </svg>
      `;

      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-code-${this.config.terminalId || 'terminal'}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('SVG download error:', error);
      throw error;
    }
  }

  public async print(): Promise<void> {
    try {
      const canvas = await this.captureQR();
      if (!canvas) return;

      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert('Please allow popups for printing');
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code Print</title>
            <style>
              body {
                margin: 0;
                padding: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                background: #ffffff;
              }
              .print-container {
                text-align: center;
              }
              .print-container img {
                max-width: 90%;
                height: auto;
                border: 2px solid #004761;
                border-radius: 16px;
                padding: 20px;
              }
              .print-text {
                margin-top: 20px;
                font-size: 18px;
                color: #004761;
                font-weight: 500;
              }
              .print-footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
              }
              @media print {
                body { padding: 0; }
                .print-container { margin: 0 auto; }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <img src="${canvas.toDataURL('image/png')}" />
              <div class="print-text">${this.config.bottomText || 'Scan to Connect'}</div>
              <div class="print-footer">
                Terminal ID: ${this.config.terminalId || 'N/A'} | 
                Generated: ${new Date().toLocaleString()}
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            <\/script>
          </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
    } catch (error) {
      console.error('Print error:', error);
      alert('Error printing. Please try again.');
    }
  }

  public async copyToClipboard(): Promise<void> {
    try {
      const dataUrl = await this.getQRDataURL();
      if (!dataUrl) {
        throw new Error('Failed to capture QR code');
      }

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
    } catch (error) {
      console.error('Copy error:', error);
      throw error;
    }
  }

  public async getQRDataURL(): Promise<string | null> {
    const canvas = await this.captureQR();
    return canvas ? canvas.toDataURL('image/png') : null;
  }

  private async captureQR(): Promise<HTMLCanvasElement | null> {
    const element = this.qrDisplayWrapper?.nativeElement;
    if (!element) {
      console.error('QR element not found');
      return null;
    }

    try {
      await this.delay(200);

      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        backgroundColor: this.backgroundColor || '#ffffff',
        logging: false,
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      return canvas;
    } catch (error) {
      console.error('Capture error:', error);
      return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}