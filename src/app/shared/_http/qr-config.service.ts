import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class QrConfigService {
    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllQrConfig(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}qrConfig`);
    }

    getQrConfig(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}qrConfig/${id}`);
    }

    createQrConfig(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}qrConfig/`, payload);
    }

    updateQrConfig(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}qrConfig/${id}`, payload);
    }

    deleteQrConfig(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}qrConfig/${id}`);
    }
}