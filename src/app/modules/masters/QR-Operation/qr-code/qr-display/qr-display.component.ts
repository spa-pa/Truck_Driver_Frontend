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
  OnDestroy,
  HostListener
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
            <div #qrElement class="qr-element-container"></div>
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
  private resizeObserver: ResizeObserver | null = null;
  private currentSize = 0;
  private qrDataURL: string | null = null;

  @HostListener('window:resize')
onWindowResize(): void {
  clearTimeout(this.resizeDebounce);
  this.resizeDebounce = setTimeout(() => this.handleResize(), 150);
}

private resizeDebounce: any;

  ngAfterViewInit(): void {
    this.setupResizeObserver();
    setTimeout(() => {
      this.generateQR();
      this.isInitialized = true;
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isInitialized && (changes['config'] || changes['size'])) {
      setTimeout(() => {
        this.generateQR();
      }, 50);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.qrCode) {
      const element = this.qrElement?.nativeElement;
      if (element) {
        element.innerHTML = '';
      }
      this.qrCode = null as any;
    }
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined' && this.qrWrapper) {
      let firstCallback = true;
      this.resizeObserver = new ResizeObserver(() => {
        if (firstCallback) { firstCallback = false; return; }
        this.handleResize();
      });
      this.resizeObserver.observe(this.qrWrapper.nativeElement);
    }
  }

  private handleResize(): void {
    if (!this.qrWrapper) return;

    const container = this.qrWrapper.nativeElement;
    const containerWidth = container.offsetWidth;
    const newSize = this.getResponsiveSize();

    if (Math.abs(newSize - this.currentSize) > 10) {
      this.currentSize = newSize;
      this.generateQR();
    }
  }

  private getMaxSize(): number {
    const sizes = {
      small: 180,
      medium: 250,
      large: 350
    };

    let baseSize = sizes[this.size] || 250;

    if (window.innerWidth < 480) {
      baseSize = Math.min(baseSize, 120);
    } else if (window.innerWidth < 768) {
      baseSize = Math.min(baseSize, 150);
    } else if (window.innerWidth < 1024) {
      baseSize = Math.min(baseSize, 180);
    }

    return baseSize;
  }

  public generateQR(): void {
    if (!this.qrElement) {
      console.warn('QR element not ready');
      return;
    }

    try {
      const element = this.qrElement.nativeElement;
      const size = this.getResponsiveSize();
      this.currentSize = size;

      const { cornerType, cornerDotType } = this.getCornerStyles();
      let qrData = this.generateQRData();

      const qrOptions: any = {
        width: size,
        height: size,
        data: qrData,
        margin: 8,
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

      if (this.config.logoUrl && this.config.logoUrl.trim() !== '') {
        qrOptions.image = this.config.logoUrl;
      }

      element.innerHTML = '';
      this.qrCode = new QRCodeStyling(qrOptions);
      this.qrCode.append(element);

      this.centerLogo();
      this.qrGenerated.emit();

      // Cache the QR data URL after generation
      setTimeout(() => {
        this.cacheQRDataURL();
      }, 300);

    } catch (error) {
      console.error('QR Generation Error:', error);
      const element = this.qrElement.nativeElement;
      element.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:${this.currentSize || 150}px;color:#d32f2f;font-size:12px;">
          Error
        </div>
      `;
    }
  }

  private cacheQRDataURL(): void {
    const canvas = this.getQRCanvas();
    if (canvas && canvas.width > 0 && canvas.height > 0) {
      try {
        this.qrDataURL = canvas.toDataURL('image/png');
        console.log('QR data URL cached, size:', this.qrDataURL.length);
      } catch (e) {
        console.warn('Failed to cache QR data URL:', e);
      }
    }
  }

  // Public method to get QR code as data URL
  public getQRDataURLSync(): string | null {
    return this.qrDataURL;
  }

  // Public method to get QR canvas
  public getQRCanvas(): HTMLCanvasElement | null {
    const element = this.qrElement?.nativeElement;
    if (!element) return null;

    const canvas = element.querySelector('canvas');
    return canvas as HTMLCanvasElement | null;
  }

  // Public method to get QR as data URL with promise
  public async getQRDataURLAsync(): Promise<string | null> {
    // If we have cached data URL, return it
    if (this.qrDataURL) {
      return this.qrDataURL;
    }

    // Try to get from canvas
    const canvas = this.getQRCanvas();
    if (canvas && canvas.width > 0 && canvas.height > 0) {
      try {
        this.qrDataURL = canvas.toDataURL('image/png');
        return this.qrDataURL;
      } catch (e) {
        console.warn('Failed to get QR data URL from canvas:', e);
      }
    }

    // Wait for QR to render
    await this.delay(500);

    // Try again
    const canvas2 = this.getQRCanvas();
    if (canvas2 && canvas2.width > 0 && canvas2.height > 0) {
      try {
        this.qrDataURL = canvas2.toDataURL('image/png');
        return this.qrDataURL;
      } catch (e) {
        console.warn('Failed to get QR data URL from canvas on retry:', e);
      }
    }

    return null;
  }

  private getResponsiveSize(): number {
    const baseSize = this.config.qrSize || this.getSizeFromInput();
    const viewportWidth = window.innerWidth;

    if (viewportWidth < 480) {
      return Math.min(baseSize, 100);
    } else if (viewportWidth < 768) {
      return Math.min(baseSize, 130);
    } else if (viewportWidth < 1024) {
      return Math.min(baseSize, 160);
    } else {
      return baseSize;
    }
  }

  private getSizeFromInput(): number {
    const sizes = {
      small: 180,
      medium: 250,
      large: 350
    };
    return sizes[this.size] || 250;
  }

  private generateQRData(): string {
    //const baseUrl = environment.SACNNING_BASE_URL || 'http://localhost:4200';
    const baseUrl = environment.SACNNING_BASE_URL

    if (this.config.data && this.config.data !== ' ') {
      return this.config.data;
    }

    const url = `${baseUrl}/safety-training`;
    return url;
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
        (logo as HTMLElement).style.maxWidth = '25%';
        (logo as HTMLElement).style.maxHeight = '25%';
      }

      const canvas = element.querySelector('canvas');
      if (canvas) {
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
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

  // Renders the QR off-DOM at a fixed size, bypassing getResponsiveSize()'s
// window.innerWidth capping — used only for exports (PDF/print) so the
// output is identical no matter which device triggered it.
public async getExportCanvas(exportSize?: number): Promise<HTMLCanvasElement | null> {
  const size = exportSize || this.config.qrSize || this.getSizeFromInput();
  const { cornerType, cornerDotType } = this.getCornerStyles();

  const qrOptions: any = {
    width: size,
    height: size,
    data: this.generateQRData(),
    margin: 8,
    dotsOptions: { color: this.config.qrColor || '#004761', type: this.config.dotType || 'rounded' },
    backgroundOptions: { color: this.config.bgColor || '#ffffff' },
    cornersSquareOptions: { type: cornerType },
    cornersDotOptions: { type: cornerDotType },
    imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: 0.25 }
  };
  if (this.config.logoUrl?.trim()) qrOptions.image = this.config.logoUrl;

  const offscreen = document.createElement('div');
  offscreen.style.position = 'fixed';
  offscreen.style.left = '-99999px';
  document.body.appendChild(offscreen);

  try {
    new QRCodeStyling(qrOptions).append(offscreen);
    await this.delay(150);
    const canvas = offscreen.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return null;

    const out = document.createElement('canvas');
    out.width = canvas.width;
    out.height = canvas.height;
    out.getContext('2d')?.drawImage(canvas, 0, 0);
    return out;
  } finally {
    document.body.removeChild(offscreen);
  }
}

}