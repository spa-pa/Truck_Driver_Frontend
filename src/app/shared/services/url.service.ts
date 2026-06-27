import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  
  getDriverTrainingUrl(terminalId?: number): string {
    const baseUrl = environment.SACNNING_BASE_URL || 'http://localhost:4200';
    let url = `${baseUrl}driver-training`;
    
    // Add terminalId as query parameter if provided
    if (terminalId) {
      url += `?terminalId=${terminalId}`;
    }
    
    return url;
  }
  
  getBaseUrl(): string {
    return environment.SACNNING_BASE_URL || 'http://localhost:4200';
  }
}