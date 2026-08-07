// src/app/services/qr-config.service.ts

import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QRConfig, QRResponse, DEFAULT_QR_CONFIG } from '../models/qr.model';

@Injectable({
    providedIn: 'root'
})
export class QRConfigService {
    private configSubject = new BehaviorSubject<QRConfig>({ ...DEFAULT_QR_CONFIG });
    private responseSubject = new BehaviorSubject<QRResponse | null>(null);

    config$: Observable<QRConfig> = this.configSubject.asObservable();
    response$: Observable<QRResponse | null> = this.responseSubject.asObservable();

    configChanged = new EventEmitter<QRConfig>();

    constructor() {
        this.loadFromLocalStorage();
    }

    getConfig(): QRConfig {
        return this.configSubject.getValue();
    }

    updateConfig(updates: Partial<QRConfig>): void {
        const current = this.getConfig();
        const updated = { ...current, ...updates };

        updated.updatedAt = new Date().toISOString();

        this.configSubject.next(updated);
        this.configChanged.emit(updated);
        this.generateResponse();
        this.saveToLocalStorage();
    }

    updateConfigFromResponse(response: QRResponse): void {
        if (response.qrJson) {
            const config = {
                ...this.getConfig(),
                ...response.qrJson,
                terminalId: response.terminalId
            };
            this.configSubject.next(config);
            this.responseSubject.next(response);
            this.configChanged.emit(config);
            this.saveToLocalStorage();
        }
    }

    getResponse(): QRResponse | null {
        return this.responseSubject.getValue();
    }

    resetConfig(): void {
        const reset = { ...DEFAULT_QR_CONFIG };
        reset.createdAt = new Date().toISOString();
        reset.updatedAt = new Date().toISOString();
        this.configSubject.next(reset);
        this.generateResponse();
        this.saveToLocalStorage();
    }

    private generateResponse(): void {
        const config = this.getConfig();
        const response: QRResponse = {
            terminalId: config.terminalId || 0,
            qrJson: { ...config }
        };
        this.responseSubject.next(response);
    }

    private saveToLocalStorage(): void {
        try {
            const config = this.getConfig();
            localStorage.setItem('qrConfig', JSON.stringify(config));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    private loadFromLocalStorage(): void {
        try {
            const saved = localStorage.getItem('qrConfig');
            if (saved) {
                const config = JSON.parse(saved);
                this.configSubject.next({ ...DEFAULT_QR_CONFIG, ...config });
                this.generateResponse();
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
        }
    }

    exportConfig(): string {
        return JSON.stringify(this.getConfig(), null, 2);
    }

    importConfig(jsonString: string): boolean {
        try {
            const config = JSON.parse(jsonString);
            this.configSubject.next({ ...DEFAULT_QR_CONFIG, ...config });
            this.generateResponse();
            this.saveToLocalStorage();
            return true;
        } catch (e) {
            console.error('Invalid config JSON:', e);
            return false;
        }
    }
}