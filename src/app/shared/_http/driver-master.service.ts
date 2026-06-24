// role.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DriverMasterService {

    // Base URL for API requests
    baseUrl: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL;
    }

    /**
     * Fetches all driverMaster available for view.
     * @returns Observable containing role list
     */
    getAlldriverMaster(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}driverMaster/`);
    }

    /**
     * Retrieves role details by ID.
     * @param id - Role identifier
     * @returns Observable containing role data
     */
    getdriverMasterByCertificationId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}driverMaster/certification/${id}`);
    }

    /**
     * Creates a new role.
     * @param payload - Role data to be created
     * @returns Observable of server response
     */
    createdriverMaster(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}driverMaster/`, payload);
    }

    /**
     * Updates an existing role.
     * @param payload - Updated role data
     * @param id - Role identifier
     * @returns Observable of server response
     */
    updatedriverMaster(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}driverMaster/${id}`, payload);
    }

    /**
     * Deletes a role by ID.
     * @param id - Role identifier
     * @returns Observable of server response
     */
    deletedriverMaster(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}driverMaster/${id}`);
    }

}
