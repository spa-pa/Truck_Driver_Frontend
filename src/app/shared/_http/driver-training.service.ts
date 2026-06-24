// role.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DriverTrainingService {

    // Base URL for API requests
    baseUrl: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL;
    }

    /**
     * Fetches all driverTraining available for view.
     * @returns Observable containing role list
     */
    getAlldriverTraining(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}driverTraining/`);
    }

    /**
     * Retrieves role details by ID.
     * @param id - Role identifier
     * @returns Observable containing role data
     */
    getdriverTrainingByCertificationId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}driverTraining/certification/${id}`);
    }

    /**
     * Creates a new role.
     * @param payload - Role data to be created
     * @returns Observable of server response
     */
    createdriverTraining(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}driverTraining/`, payload);
    }

    /**
     * Updates an existing role.
     * @param payload - Updated role data
     * @param id - Role identifier
     * @returns Observable of server response
     */
    updatedriverTraining(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}driverTraining/${id}`, payload);
    }

    /**
     * Deletes a role by ID.
     * @param id - Role identifier
     * @returns Observable of server response
     */
    deletedriverTraining(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}driverTraining/${id}`);
    }

}
