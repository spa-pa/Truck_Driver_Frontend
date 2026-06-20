import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";

/**
 * Service responsible for handling all HTTP requests related to
 * roles and their associated page permissions.
 */
@Injectable()
export class RoleAndPermissionsControllerService {
  // Base API URL fetched from environment configuration
  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.API_BASE_URL;
  }

  /**
   * Fetches the list of all roles.
   * @returns Observable containing role data
   */
  getAllRoles(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}roles`);
  }

  /**
   * Retrieves all role-page permission mappings.
   * @returns Observable with role-page-permission data
   */
  getAllPageRolesPermission(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}role-page-permissions`);
  }

  /**
   * Retrieves a specific role-page permission entry by ID.
   * @param id Role-page-permission ID
   * @returns Observable with the corresponding data
   */
  getRolePagePermission(id: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}role-page-permissions/${id}`);
  }

  /**
   * Creates a new role-page permission record.
   * @param payload Payload containing new role-page permission details
   * @returns Observable with server response
   */
  createRolePagePermission(payload: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}role-page-permissions`, payload);
  }

  /**
   * Updates an existing role-page permission entry.
   * @param payload Updated data for the role-page permission
   * @param id ID of the record to update
   * @returns Observable with server response
   */
  updateRolePagePermission(payload: any, id: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}role-page-permissions/${id}`, payload);
  }

  /**
   * Deletes a role-page permission entry by ID.
   * @param id ID of the record to delete
   * @returns Observable with server response
   */
  deleteRolePagePermission(id: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}role-page-permissions/${id}`);
  }
}
