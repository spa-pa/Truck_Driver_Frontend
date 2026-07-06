import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DriverCertification } from '@shared/models/driver-certification.model';
import { QRDisplayComponent } from '../../QR-Operation/qr-code/qr-display/qr-display.component';
import { Subscription } from 'rxjs';
import { DriverCertificationService } from '@shared/_http/driver-certification.service';

@Component({
  selector: 'app-driver-certification',
  standalone: true,
  imports: [CommonModule, QRDisplayComponent],
  templateUrl: './driver-certification.component.html',
  styleUrls: ['./driver-certification.component.scss']
})
export class DriverCertificationComponent implements OnInit, OnDestroy {
  @ViewChild('certificationCard') certificationCard!: ElementRef;
  @Input() certificationId: string = '';
  @Input() autoLoad: boolean = true;

  certificationDetailsId: any;
  certification: DriverCertification | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  subs: any;
  qrConfig: any = {
    data: '',
    qrColor: '#004761',
    bgColor: '#ffffff',
    qrSize: 150,
    dotType: 'rounded',
    bottomText: 'Driver Certification',
    textSize: 12,
    textColor: '#004761',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'normal'
  };

  constructor(
    private driverCertificationService: DriverCertificationService
  ) { }

  ngOnInit(): void {
    this.subs = new Subscription();
    if (this.autoLoad && this.certificationId) {
      this.loadCertification();
    }
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  loadCertification(): void {
    if (!this.certificationId) {
      this.error = 'No certification ID provided';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.subs.add(
      this.driverCertificationService.getDriverCertificationByCertificationId(this.certificationId).subscribe({
        next: (value) => {
          this.certification = value.data;
          this.isLoading = false;
          this.updateQRCode();
        },
        error: (err) => {
          console.error('Error loading certification:', err);
          this.isLoading = false;
          this.error = err.error?.message || 'Failed to load certification details. Please try again.';
        }
      })
    );
  }

  private updateQRCode(): void {
    if (!this.certification) return;

    const qrData = {
      certification_id: this.certification.certification_id,
    };

    this.qrConfig = {
      data: JSON.stringify(qrData),
    };

    this.certificationDetailsId = {
      ...this.qrConfig,
    };
  }

  // ============ EXPIRY HELPERS ============

  isExpired(): boolean {
    if (!this.certification) return false;
    const expiryDate = new Date(this.certification.expiry_date);
    return expiryDate < new Date();
  }

  isExpiringSoon(): boolean {
    if (!this.certification) return false;
    const days = this.getDaysUntilExpiry(this.certification.expiry_date);
    return days !== null && days <= 30 && days > 0;
  }

  getDaysUntilExpiry(dateString: string): number | null {
    if (!dateString) return null;
    const expiry = new Date(dateString);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getExpiryProgress(): number {
    if (!this.certification) return 0;
    const totalDays = 365;
    const daysLeft = this.getDaysUntilExpiry(this.certification.expiry_date) || 0;
    const progress = ((totalDays - daysLeft) / totalDays) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  // ============ DOWNLOAD METHODS (IMPROVED) ============

  async downloadPDF(): Promise<void> {
    const element = this.certificationCard?.nativeElement;
    if (!element) return;

    // Temporarily add a class to hide buttons and other UI elements
    element.classList.add('pdf-export');

    // Let icon fonts finish loading and the DOM settle (avoids blurry/missing
    // icons and mid-animation captures that were causing the cropped footer)
    if ((document as any).fonts?.ready) {
      await (document as any).fonts.ready;
    }
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Capture at a higher resolution for a crisp, non-blurry export
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure buttons are hidden and nothing is mid-animation in the clone
          const clonedElement = clonedDoc.querySelector('.certification-card') as HTMLElement;
          if (clonedElement) {
            clonedElement.classList.add('pdf-export');
            clonedElement.style.animation = 'none';
            clonedElement.style.transform = 'none';
            clonedElement.style.boxShadow = 'none';
          }
        }
      });

      // PNG keeps text/icons sharp (JPEG compression was the main source of blur)
      const imageData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8; // small margin so the card fills the page instead of floating in whitespace

      // Convert the element's real CSS size (96dpi) to mm. Using canvas.width/height
      // directly here (they're inflated by `scale`) was the bug that produced the
      // huge top gap and an inconsistent fit - the aspect ratio must come from the
      // actual element dimensions, not the upscaled capture.
      const pxToMm = 25.4 / 96;
      const contentWidthMm = element.scrollWidth * pxToMm;
      const contentHeightMm = element.scrollHeight * pxToMm;

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      const ratio = Math.min(availableWidth / contentWidthMm, availableHeight / contentHeightMm);

      const renderWidth = contentWidthMm * ratio;
      const renderHeight = contentHeightMm * ratio;
      const x = (pageWidth - renderWidth) / 2;
      const y = margin; // anchor near the top instead of vertically centering

      pdf.addImage(imageData, 'PNG', x, y, renderWidth, renderHeight);
      pdf.save(`Driver-Certification-${this.certification?.certification_id || 'Unknown'}.pdf`);

    } catch (error) {
      console.error('PDF download error:', error);
    } finally {
      // Remove the class after capture
      element.classList.remove('pdf-export');
    }
  }

  printCertification(): void {
    const element = this.certificationCard?.nativeElement;
    if (!element) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    const styles = Array.from(document.querySelectorAll('style'))
      .map(style => style.innerHTML)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Driver Certification</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
          <style>
            body { margin: 0; padding: 20px; background: #ffffff; font-family: Arial, sans-serif; }
            .print-container { max-width: 900px; margin: 0 auto; }
            ${styles}
            .certification-card { box-shadow: none !important; border: 2px solid #004761 !important; }
            .btn-download, .btn-print, .footer-right { display: none !important; }
            .pdf-export .footer-right { display: none !important; }
          </style>
        </head>
        <body>
          <div class="print-container">${element.outerHTML}</div>
          <script>
            window.onload = function() { window.print(); window.close(); };
          <\/script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }

  refresh(): void {
    this.loadCertification();
  }

  getDaysUntilExpirySafe(dateString: string): number {
    const days = this.getDaysUntilExpiry(dateString);
    return days !== null ? days : 0;
  }

  isCertificationActive(): boolean {
    if (!this.certification || !this.certification.expiry_date) {
      return false;
    }

    const expiryDate = new Date(this.certification.expiry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    return expiryDate >= today;
  }

  /**
 * Check if the certification is expired
 * @returns boolean - true if expired
 */
  isCertificationExpired(): boolean {
    return !this.isCertificationActive();
  }

  /**
   * Check if license is expired
   * @returns boolean - true if expired
   */
  isLicenseExpired(): boolean {
    const days = this.getLicenseDaysUntilExpiry();
    return days !== null && days <= 0;
  }

  /**
 * Get days until license expiry
 * @returns number of days or null if invalid
 */
  getLicenseDaysUntilExpiry(): number | null {
    if (!this.certification || !this.certification.driving_license_expiry_date) {
      return null;
    }

    const expiryDate = new Date(this.certification.driving_license_expiry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
 * Get days until license expiry with display text
 * @returns string - formatted days remaining or expired message
 */
  getLicenseDaysDisplay(): string {
    const days = this.getLicenseDaysUntilExpiry();
    if (days === null) {
      return 'N/A';
    }
    if (days > 0) {
      return `${days} days remaining`;
    }
    return `EXPIRED ${Math.abs(days)} days ago`;
  }

}