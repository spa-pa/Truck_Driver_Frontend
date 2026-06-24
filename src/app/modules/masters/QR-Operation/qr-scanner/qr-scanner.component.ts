// src/app/components/qr-scanner/qr-scanner.component.ts

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import jsQR from 'jsqr';
import { Subscription } from 'rxjs';
import { DriverCertificationService } from '@shared/_http/driver-certification.service';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QRScannerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Output() scanComplete = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Input() backendUrl: string = 'https://your-backend-api.com/scan';

  // Camera and Scanner States
  isCameraOn: boolean = false;
  hasCameraSupport: boolean = true;
  hasFlash: boolean = false;
  isFlashOn: boolean = false;
  isScanning: boolean = false;
  isSending: boolean = false;
  isProduction: boolean = false;

  // Scan Results
  scannedData: string | null = null;
  parsedData: any = null;
  scanStatus: 'scanning' | 'success' | 'error' | null = null;
  statusMessage: string = '';

  // Backend
  backendResponse: any = null;

  private stream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private isDestroyed: boolean = false;

  subs: any;

  constructor(private http: HttpClient, private driverCertificationService: DriverCertificationService) { }

  ngOnInit(): void {
    this.subs = new Subscription();
    this.checkCameraSupport();
    this.isProduction = window.location.hostname !== 'localhost' &&
      !window.location.hostname.includes('127.0.0.1');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.startCamera();
    }, 500);
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.stopCamera();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  getDriverCertificationDaa() {
    this.subs.add(this.driverCertificationService.getDriverCertificationByCertificationId(1).subscribe({
      next: (value) => {
      }
    }))
  }
  // ============ CAMERA METHODS ============

  private checkCameraSupport(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.hasCameraSupport = false;
      this.isCameraOn = false;
    }
  }

  async startCamera(): Promise<void> {
    if (this.isCameraOn || !this.hasCameraSupport) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      const video = this.videoElement.nativeElement;
      video.srcObject = this.stream;
      await video.play();

      const track = this.stream.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = track.getCapabilities() as any;
          this.hasFlash = capabilities.torch !== undefined ||
            (capabilities as any).flash !== undefined ||
            (capabilities as any).torch !== undefined;
        } catch (e) {
          this.hasFlash = false;
        }
      }

      this.isCameraOn = true;
      this.isScanning = true;
      this.scanStatus = 'scanning';
      this.statusMessage = 'Scanning for QR code...';
      this.scanLoop();

    } catch (error) {
      console.error('Camera error:', error);
      this.hasCameraSupport = false;
      this.isCameraOn = false;
      this.scanStatus = 'error';
      this.statusMessage = 'Failed to access camera. Please upload an image instead.';
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraOn = false;
    this.isScanning = false;
    this.isFlashOn = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  toggleCamera(): void {
    if (this.isCameraOn) {
      this.stopCamera();
    } else {
      this.startCamera();
    }
  }

  toggleFlash(): void {
    if (!this.hasFlash || !this.stream) return;

    try {
      const track = this.stream.getVideoTracks()[0];
      if (track) {
        this.isFlashOn = !this.isFlashOn;
        const constraints = {
          advanced: [{
            torch: this.isFlashOn
          }] as any
        };

        track.applyConstraints(constraints)
          .then(() => {
            console.log('Flash toggled:', this.isFlashOn);
          })
          .catch((err) => {
            console.error('Flash error:', err);
            this.isFlashOn = !this.isFlashOn;
          });
      }
    } catch (error) {
      console.error('Flash toggle error:', error);
      this.isFlashOn = !this.isFlashOn;
    }
  }

  // ============ SCANNING METHODS ============

  private scanLoop(): void {
    if (this.isDestroyed || !this.isScanning) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          this.handleScannedData(code.data);
          return;
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.scanLoop());
  }

  private handleScannedData(data: string): void {
    if (this.isDestroyed) return;

    this.isScanning = false;
    this.scanStatus = 'success';
    this.statusMessage = 'QR Code scanned successfully!';
    this.scannedData = data;

    try {
      this.parsedData = JSON.parse(data);
    } catch (e) {
      this.parsedData = { raw: data };
    }

    setTimeout(() => {
      this.stopCamera();
    }, 1000);

    this.scanComplete.emit({
      data: data,
      parsed: this.parsedData
    });
  }

  // ============ IMAGE UPLOAD METHODS ============

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const image = new Image();
      image.onload = () => {
        this.scanImage(image);
      };
      image.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  private scanImage(image: HTMLImageElement): void {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;
    context?.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
    if (imageData) {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        this.handleScannedData(code.data);
      } else {
        this.scanStatus = 'error';
        this.statusMessage = 'No QR code found in the image. Please try again.';
        setTimeout(() => {
          this.scanStatus = null;
          this.statusMessage = '';
        }, 3000);
      }
    }
  }

  // ============ BACKEND METHODS ============

  async sendToBackend(): Promise<void> {
    if (!this.scannedData || this.isSending) return;

    this.isSending = true;
    this.backendResponse = null;

    try {
      const payload = {
        terminalId: this.parsedData?.terminalId || this.parsedData?.id || null,
        data: this.scannedData,
        parsedData: this.parsedData,
        timestamp: new Date().toISOString(),
        device: 'qr-scanner'
      };

      const response = 'Successfull';

      this.subs.add(this.driverCertificationService.getDriverCertificationByCertificationId(payload).subscribe({
        next: (value) => {
          this.backendResponse = {
            success: true,
            message: response || 'Data sent successfully'
          };
        }
      }))



    } catch (error: any) {
      console.error('Backend error:', error);
      this.backendResponse = {
        success: false,
        message: error.error || 'Failed to send data to backend'
      };
    } finally {
      this.isSending = false;
    }
  }

  // ============ UTILITY METHODS ============

  copyToClipboard(): void {
    if (!this.scannedData) return;

    navigator.clipboard.writeText(this.scannedData)
      .then(() => {
        this.scanStatus = 'success';
        this.statusMessage = 'Data copied to clipboard!';
        setTimeout(() => {
          this.scanStatus = null;
          this.statusMessage = '';
        }, 2000);
      })
      .catch(err => {
        console.error('Copy error:', err);
        this.scanStatus = 'error';
        this.statusMessage = 'Failed to copy data';
        setTimeout(() => {
          this.scanStatus = null;
          this.statusMessage = '';
        }, 2000);
      });
  }

  clearScannedData(): void {
    this.scannedData = null;
    this.parsedData = null;
    this.backendResponse = null;
    this.isSending = false;
    this.scanStatus = null;
    this.statusMessage = '';
    if (!this.isCameraOn && this.hasCameraSupport) {
      this.startCamera();
    }
  }

  closeScanner(): void {
    this.stopCamera();
    this.close.emit();
  }

  generateTestData(): void {
    const testData = {
      certification_id: '1781968993303280'
    };
    this.handleScannedData(JSON.stringify(testData));
  }
}