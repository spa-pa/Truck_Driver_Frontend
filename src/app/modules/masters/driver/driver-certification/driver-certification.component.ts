import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DriverCertification } from "@shared/models/driver-certification.model";
import { QRDisplayComponent } from "../../QR-Operation/qr-code/qr-display/qr-display.component";
import { Subscription } from "rxjs";
import { DriverCertificationService } from "@shared/_http/driver-certification.service";

@Component({
  selector: "app-driver-certification",
  standalone: true,
  imports: [CommonModule, QRDisplayComponent],
  templateUrl: "./driver-certification.component.html",
  styleUrls: ["./driver-certification.component.scss"],
})
export class DriverCertificationComponent implements OnInit, OnDestroy {
  @ViewChild("certificationCard") certificationCard!: ElementRef;
  @Input() certificationId: string = "";
  @Input() autoLoad: boolean = true;

  certificationDetailsId: any;
  certification: DriverCertification | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  isDownloading: boolean = false; // <-- NEW

  subs: any;
  qrConfig: any = {
    data: "",
    qrColor: "#004761",
    bgColor: "#ffffff",
    qrSize: 150,
    dotType: "rounded",
    bottomText: "Driver Certification",
    textSize: 12,
    textColor: "#004761",
    fontFamily: "Inter, sans-serif",
    fontWeight: "normal",
  };

  constructor(private driverCertificationService: DriverCertificationService) {}

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
      this.error = "No certification ID provided";
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.subs.add(
      this.driverCertificationService
        .getDriverCertificationByCertificationId(this.certificationId)
        .subscribe({
          next: (value) => {
            this.certification = value.data;
            this.isLoading = false;
            this.updateQRCode();
             // Force QR to render on mobile by re-triggering after DOM paint
            setTimeout(() => this.updateQRCode(), 100);
          },
          error: (err) => {
            console.error("Error loading certification:", err);
            this.isLoading = false;
            this.error =
              err.error?.message ||
              "Failed to load certification details. Please try again.";
          },
        }),
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

  // ============ DRIVER PHOTO ============

  // Returns the driver's photo URL, or null if none was uploaded during
  // registration - the template falls back to a placeholder icon in that case.
  getDriverPhotoUrl(): string | null {
    return (this.certification as any)?.driving_img || null;
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
    const daysLeft =
      this.getDaysUntilExpiry(this.certification.expiry_date) || 0;
    const progress = ((totalDays - daysLeft) / totalDays) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  // ============ DOWNLOAD PDF (DEVICE-INDEPENDENT) ============

  private readonly PDF_WIDTH = 800;
  private readonly PDF_SCALE = 2;
  private readonly PDF_JPEG_QUALITY = 0.85;

  async downloadPDF(): Promise<void> {
    this.isDownloading = true;

    const original = this.certificationCard?.nativeElement as HTMLElement;
     if (!original) {
      this.isDownloading = false;
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '-99999px'; // off-screen, but still laid out/rendered
    wrapper.style.width = `${this.PDF_WIDTH}px`;
    wrapper.style.background = '#ffffff';
    wrapper.style.zIndex = '-1';
    wrapper.style.pointerEvents = 'none';

    const clone = original.cloneNode(true) as HTMLElement;
    clone.classList.add('pdf-export');
    clone.style.width = `${this.PDF_WIDTH}px`;
    clone.style.maxWidth = `${this.PDF_WIDTH}px`;
    clone.style.margin = '0';
    clone.style.animation = 'none';
    clone.style.transform = 'none';
    clone.style.setProperty('box-shadow', 'none', 'important');

    // Buttons shouldn't appear in the PDF
    clone.querySelectorAll('.btn-download, .btn-print').forEach((btn) => btn.remove());

    const originalCanvases = original.querySelectorAll('canvas');
    const clonedCanvases = clone.querySelectorAll('canvas');
    originalCanvases.forEach((srcCanvas, i) => {
      const destCanvas = clonedCanvases[i] as HTMLCanvasElement;
      if (destCanvas) {
        destCanvas.width = srcCanvas.width;
        destCanvas.height = srcCanvas.height;
        destCanvas.getContext('2d')?.drawImage(srcCanvas, 0, 0);
      }
    });

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      const fontsReady = (document as any).fonts?.ready ?? Promise.resolve();
      const paintSettled = new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      await Promise.all([fontsReady, paintSettled]);

      const canvas = await html2canvas(clone, {
        scale: this.PDF_SCALE,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        width: this.PDF_WIDTH,
        windowWidth: this.PDF_WIDTH,
      });

      const imageData = canvas.toDataURL('image/jpeg', this.PDF_JPEG_QUALITY);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;

      const pxToMm = 25.4 / 96;
      const contentWidthMm = this.PDF_WIDTH * pxToMm;
      const contentHeightMm = (canvas.height / canvas.width) * this.PDF_WIDTH * pxToMm;

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      const ratio = Math.min(
        availableWidth / contentWidthMm,
        availableHeight / contentHeightMm,
      );

      const renderWidth = contentWidthMm * ratio;
      const renderHeight = contentHeightMm * ratio;
      const x = (pageWidth - renderWidth) / 2;
      const y = margin; // anchor near the top so the card fills the page instead of floating

      pdf.addImage(
        imageData,
        'JPEG',
        x,
        y,
        renderWidth,
        renderHeight,
        undefined,
        'NONE',
      );
      pdf.save(
        `Driver-Certification-${this.certification?.certification_id || 'Unknown'}.pdf`,
      );
    } catch (error) {
      console.error('PDF download error:', error);
    } finally {
      document.body.removeChild(wrapper);
      this.isDownloading = false;
    }
  }

  printCertification(): void {
    const element = this.certificationCard?.nativeElement;
    if (!element) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      alert("Please allow popups for printing");
      return;
    }

    const styles = Array.from(document.querySelectorAll("style"))
      .map((style) => style.innerHTML)
      .join("");

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

  isCertificationExpired(): boolean {
    return !this.isCertificationActive();
  }

  isLicenseExpired(): boolean {
    const days = this.getLicenseDaysUntilExpiry();
    return days !== null && days <= 0;
  }

  getLicenseDaysUntilExpiry(): number | null {
    if (
      !this.certification ||
      !this.certification.driving_license_expiry_date
    ) {
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

  getLicenseDaysDisplay(): string {
    const days = this.getLicenseDaysUntilExpiry();
    if (days === null) {
      return "N/A";
    }
    if (days > 0) {
      return `${days} days remaining`;
    }
    return `EXPIRED ${Math.abs(days)} days ago`;
  }
}