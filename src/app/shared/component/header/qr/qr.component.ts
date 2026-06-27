import { Component, ViewChild } from '@angular/core';
import { TooltipModule } from "primeng/tooltip";
import { QRViewerModalComponent } from './qr-viewer-modal/qr-viewer-modal.component';
import { UrlService } from '@shared/services/url.service';
import { currentUser } from '@shared/utils/current-user';

@Component({
  selector: 'app-qr',
  imports: [TooltipModule, QRViewerModalComponent],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.scss'
})
export class QrComponent {

  @ViewChild('qrModal') qrModal!: QRViewerModalComponent;


  qrDataString: string = '';
  terminalId: number;

  constructor(private urlService: UrlService) {
    // Generate the URL for driver-training
    this.qrDataString = this.urlService.getDriverTrainingUrl(this.terminalId);
  }

  qRcode(): void {
    this.openQRModal();
  }

  openQRModal(): void {
    if (this.qrModal) {
      this.qrModal.qrData = this.qrDataString;
      this.qrModal.terminalId = currentUser().terminal_id;
      this.qrModal.openModal();
    }
  }

  openScanner() {

  }

}
