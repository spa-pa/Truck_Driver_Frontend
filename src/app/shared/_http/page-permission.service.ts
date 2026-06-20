import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class PagePermissionService {
    private baseUrl: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL;
    }

    // -------------------------------------------------
    // GET APIs
    // -------------------------------------------------

    /**
     * Fetches all page-permission mappings.
     */
    getAllPagePermissions(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}PagePermission/`);
    }

    /**
     * Retrieves a specific page permission by its ID.
     * @param id - The unique identifier of the page permission.
     */
    getPagePermission(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}PagePermission/${id}/`);
    }

    /**
     * Gets all roles and their permission mapping for a given page.
     * @param id - The page ID to retrieve permissions for.
     */
    getRoleByPageId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}page-permission/getByPageId/AllPermission/${id}`);
    }

    // -------------------------------------------------
    // POST & PUT APIs
    // -------------------------------------------------

    /**
     * Creates a new page permission.
     * Adds the currently logged-in user as the creator.
     * @param payload - The permission data to be created.
     */
    createPagePermission(payload: any): Observable<any> {
        payload['created_by'] = currentUser().user_id;
        return this.httpClient.post(`${this.baseUrl}page-permission`, payload);
    }

    /**
     * Updates an existing page permission.
     * Adds the currently logged-in user as the modifier.
     * @param payload - The updated permission data.
     * @param id - The unique identifier of the page permission to update.
     */
    updatePagePermission(payload: any, id: any): Observable<any> {
        payload['modified_by'] = currentUser().user_id;
        return this.httpClient.put(`${this.baseUrl}page-permission/${id}`, payload);
    }

    /**
     * Creates or updates multiple page permissions in bulk.
     * Adds the currently logged-in user as the creator.
     * @param payload - Bulk payload for creation or update.
     */
    updateCreatePagePermission(payload: any): Observable<any> {
        payload['created_by'] = currentUser().user_id;
        return this.httpClient.put(`${this.baseUrl}page-permission/create/update`, payload);
    }

    // -------------------------------------------------
    // DELETE API
    // -------------------------------------------------

    /**
     * Deletes a page permission by its ID.
     * @param id - The unique identifier of the permission to be deleted.
     */
    deletePagePermission(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}page-permission/${id}`);
    }
}
