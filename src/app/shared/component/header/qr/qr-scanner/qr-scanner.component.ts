import { Component } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { QRViewerModalComponent } from '../qr-viewer-modal/qr-viewer-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-scanner',
  imports: [TooltipModule],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss'
})
export class QrScannerComponent {

  constructor(private router: Router) { }

  openScanner() {
    this.router.navigate(['/qr-scan-details'])
  }

}
