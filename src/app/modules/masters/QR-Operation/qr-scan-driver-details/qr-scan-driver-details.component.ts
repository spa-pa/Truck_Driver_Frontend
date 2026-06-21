import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DriverCertificationComponent } from '@modules/masters/driver-certification/driver-certification.component';
import { QRScannerModalComponent } from '@shared/component/header/qr/qr-scanner-modal/qr-scanner-modal.component';

@Component({
  selector: 'app-qr-scan-driver-details',
  imports: [CommonModule, QRScannerModalComponent, DriverCertificationComponent],
  templateUrl: './qr-scan-driver-details.component.html',
  styleUrl: './qr-scan-driver-details.component.scss'
})
export class QRScanDriverDetailsComponent {
  @ViewChild('certification') certificationComponent!: DriverCertificationComponent;
  
  certificationId: string = '';

  onScanComplete(data: any): void {
    console.log('Scan complete:', data);

    // Check if scanned data has certification_id
    if (data.parsed && data.parsed.certification_id) {
      this.certificationId = data.parsed.certification_id;
      
      // Scroll to certification section
      setTimeout(() => {
        const element = document.querySelector('.certification-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }

  refreshCertification(): void {
    if (this.certificationComponent) {
      this.certificationComponent.refresh();
    }
  }

  clearCertification(): void {
    this.certificationId = '';
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}