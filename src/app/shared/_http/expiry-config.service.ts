import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class ExpiryConfigService {
    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllExpiryConfig(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}expiryConfig`);
    }

    getExpiryConfig(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}expiryConfig/${id}`);
    }

    createExpiryConfig(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}expiryConfig/`, payload);
    }

    updateExpiryConfig(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}expiryConfig/${id}`, payload);
    }

    deleteExpiryConfig(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}expiryConfig/${id}`);
    }
}