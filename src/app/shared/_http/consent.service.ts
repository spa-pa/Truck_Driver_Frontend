import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {

      private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllConsents(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}consentMaster`);
    }

    createConsent(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}consentMaster`, payload);
    }

    getConsentById(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}consentMaster/${id}`);
    }

    getConsentByLanguageId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}consentMaster/language/${id}`);
    }

    updateConsent(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}consentMaster/${id}`, payload);
    }

    deleteConsent(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}consentMaster/${id}`);
    }
}
