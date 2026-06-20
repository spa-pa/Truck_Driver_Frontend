// role.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  // Base URL for API requests
  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.API_BASE_URL;
  }

  /**
   * Fetches all roles available for view.
   * @returns Observable containing role list
   */
  getAllRoles(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}RoleMaster/`);
  }

  /**
   * Retrieves role details by ID.
   * @param id - Role identifier
   * @returns Observable containing role data
   */
  getRole(id: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}RoleMaster/${id}`);
  }

  /**
   * Creates a new role.
   * @param payload - Role data to be created
   * @returns Observable of server response
   */
  createRole(payload: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}RoleMaster/`, payload);
  }

  /**
   * Updates an existing role.
   * @param payload - Updated role data
   * @param id - Role identifier
   * @returns Observable of server response
   */
  updateRole(payload: any, id: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}RoleMaster/${id}`, payload);
  }

  /**
   * Deletes a role by ID.
   * @param id - Role identifier
   * @returns Observable of server response
   */
  deleteRole(id: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}RoleMaster/${id}`);
  }

}
