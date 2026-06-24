// role.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DriverCertificationService {

    // Base URL for API requests
    baseUrl: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL;
    }

    /**
     * Fetches all DriverCertification available for view.
     * @returns Observable containing role list
     */
    getAllDriverCertification(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}driverCertification/`);
    }

    /**
     * Retrieves role details by ID.
     * @param id - Role identifier
     * @returns Observable containing role data
     */
    getDriverCertificationByCertificationId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}driverCertification/certification/${id}`);
    }

    /**
     * Creates a new role.
     * @param payload - Role data to be created
     * @returns Observable of server response
     */
    createDriverCertification(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}driverCertification/`, payload);
    }

    /**
     * Updates an existing role.
     * @param payload - Updated role data
     * @param id - Role identifier
     * @returns Observable of server response
     */
    updateDriverCertification(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}driverCertification/${id}`, payload);
    }

    /**
     * Deletes a role by ID.
     * @param id - Role identifier
     * @returns Observable of server response
     */
    deleteDriverCertification(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}driverCertification/${id}`);
    }

}
