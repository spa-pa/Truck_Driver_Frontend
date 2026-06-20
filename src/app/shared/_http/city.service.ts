import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class CityService {
    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllCity(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}cityMaster`);
    }

    getByCountryId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}cityMaster/byCountry/${id}`);
    }

    getCity(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}cityMaster/${id}`);
    }

    createCity(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}cityMaster/`, payload);
    }

    updateCity(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}cityMaster/${id}`, payload);
    }

    deleteCity(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}cityMaster/${id}`);
    }
}