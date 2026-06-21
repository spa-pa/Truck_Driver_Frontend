// src/app/models/qr.model.ts

export interface QRResponse {
  terminalId: number;
  qrJson: QRConfig;
}

export interface QRConfig {
  // QR Data
  data: string;
  
  // Styling
  qrColor: string;
  bgColor: string;
  qrSize: number;
  dotType: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
  
  // Logo
  logoUrl?: string;
  logoSize?: number;
  
  // Text below QR
  bottomText: string;
  textSize: number;
  textColor: string;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  
  // Metadata
  terminalId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_QR_CONFIG: QRConfig = {
  data: JSON.stringify({
    action: 'connect',
    device: 'terminal-123',
    timestamp: new Date().toISOString()
  }, null, 2),
  qrColor: '#004761',
  bgColor: '#ffffff',
  qrSize: 250,
  dotType: 'rounded',
  logoUrl: '',
  bottomText: 'Scan to Connect',
  textSize: 18,
  textColor: '#004761',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontWeight: 'normal',
  terminalId: 123,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};