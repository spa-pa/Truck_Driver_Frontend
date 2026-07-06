// role.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DriverTrainingService {

    baseUrl: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL;
    }

    getAlldriverTraining(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}driverTraining`);
    }

    getdriverTrainingByCertificationId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}driverTraining/certification/${id}`);
    }

    createdriverTraining(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}driverTraining/`, payload);
    }

    updatedriverTraining(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}driverTraining/${id}`, payload);
    }

    deletedriverTraining(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}driverTraining/${id}`);
    }

}
