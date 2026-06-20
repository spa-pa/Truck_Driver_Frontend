import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class CountryService {
    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllCountry(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}CountryMaster`);
    }

    getCountry(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}CountryMaster/${id}`);
    }

    createCountry(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}CountryMaster`, payload);
    }

    updateCountry(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}CountryMaster/${id}`, payload);
    }

    deleteCountry(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}CountryMaster/${id}`);
    }
}