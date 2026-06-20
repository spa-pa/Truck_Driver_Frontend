import { Component, ViewChild } from '@angular/core';
import { TooltipModule } from "primeng/tooltip";
import { QRViewerModalComponent } from './qr-viewer-modal/qr-viewer-modal.component';

@Component({
  selector: 'app-qr',
  imports: [TooltipModule, QRViewerModalComponent],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.scss'
})
export class QrComponent {

  @ViewChild('qrModal') qrModal!: QRViewerModalComponent;

  terminalId: number = 123;
  qrDataString: string = JSON.stringify({
    action: 'connect',
    device: 'terminal-123',
    timestamp: new Date().toISOString()
  });

  qRcode(): void {
    this.openQRModal();
  }

  openQRModal(): void {
    if (this.qrModal) {
      this.qrModal.openModal();
    }
  }
}
