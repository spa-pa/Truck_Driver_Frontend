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

    try {
      // Capture with optimized settings
      const canvas = await html2canvas(element, {
        scale: 1.5,                  // reduced from 3 to keep file size small
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure buttons are hidden in the cloned document as well
          const clonedElement = clonedDoc.querySelector('.certification-card');
          if (clonedElement) {
            clonedElement.classList.add('pdf-export');
          }
        }
      });

      // Convert to JPEG with quality 0.9 to reduce size
      const imageData = canvas.toDataURL('image/jpeg', 0.9);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit within A4 with margins
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min((pageWidth - 20) / imgWidth, (pageHeight - 20) / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;
      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      pdf.addImage(imageData, 'JPEG', x, y, width, height);
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
}