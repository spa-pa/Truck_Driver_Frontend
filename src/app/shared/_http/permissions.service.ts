import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { GlobalConfig } from "@shared/configs/global-config";
import { PermissionsResponse } from "@shared/models/page-permission.model";
import { currentUser } from "@shared/utils/current-user";
import { EncryptedStorage } from "@shared/utils/encrypted-storage";
import { EncryptionAPILayer } from "@shared/utils/encryption-api";
import { Observable } from "rxjs";

@Injectable()
export class PermissionControllerService {
    baseUrl: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL;
    }

    // --------------------------------------
    // GET APIs: Fetch all records by modules
    // --------------------------------------

    getAllPermissions(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}PermissionMaster/`);
    }

    getAllPages(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}PageMaster/`);
    }

    getAllPagePermission(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}pagePermissionMaster/`);
    }

    getAllRolePermissions(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}rolePagePermissionMaster/`);
    }

    // --------------------------------------
    // GET APIs: Fetch single or filtered records by ID
    // --------------------------------------

    getAllPageByID(pageid: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}PageMaster/GetById/${pageid}/`);
    }

    getAllPagePermissionByID(pagepermissionid: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}pagePermissionMaster/${pagepermissionid}/`);
    }

    getAllPagePermissionByPageId(PageId: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}page-permission/getData/byPageId?page_id=${PageId}`);
    }

    getAllPermissionsByID(permissionId: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}PermissionMaster/GetById/${permissionId}/`);
    }


    getAllRolePermissionsID(rolepagepermissionid: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}rolePagePermissionMaster/${rolepagepermissionid}/`);
    }

    // --------------------------------------
    // DELETE APIs
    // --------------------------------------

    deletePagePermissionById(pagePermissionId: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}page-permission/${pagePermissionId}/`);
    }

    deletePermissionsById(permissionid: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}PermissionMaster/Delete/${permissionid}`);
    }

    deleteRolePermissionById(rolepagepermissionid: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}group-role-page-permission/${rolepagepermissionid}/`);
    }

    // --------------------------------------
    // POST APIs: Create entities
    // --------------------------------------

    createPage(payload: any): Observable<any> {
        payload['created_by'] = currentUser().user_id;
        return this.httpClient.post(`${this.baseUrl}page/`, payload);
    }

    // createPagePermission(payload: any): Observable<any> {
    //     payload['created_by'] = currentUser().user_id;
    //     return this.httpClient.post(`${this.baseUrl}page-permission/`, payload);
    // }

    createPagePermission(payload: any): Observable<any> {
        payload['created_by'] = currentUser().user_id;
        return this.httpClient.post(`${this.baseUrl}pagePermissionMaster`, payload);
    }

    createPermission(payload: any): Observable<any> {
        payload['created_by'] = currentUser().user_id;
        return this.httpClient.post(`${this.baseUrl}permissionMaster`, payload);
    }

    createRolepermission(payload: any): Observable<any> {
        payload['created_by'] = currentUser().user_id;
        return this.httpClient.post(`${this.baseUrl}rolePagePermissionMaster/`, payload);
    }

    // --------------------------------------
    // PUT APIs: Update existing entities
    // --------------------------------------



    updatePagePermission(payload: any): Observable<any> {
        payload['created_by'] = currentUser().user_id;
        return this.httpClient.put(`${this.baseUrl}pagePermissionMaster`, payload);
    }

    // updatePagePermission(payload: any, pagePermissionId: any): Observable<any> {
    //     payload['created_by'] = currentUser().user_id;
    //     return this.httpClient.put(`${this.baseUrl}page-permission/${pagePermissionId}/`, payload);
    // }

    updatePermission(payload: any, permissionid: any): Observable<any> {
        payload['created_by'] = currentUser().user_id;
        return this.httpClient.put(`${this.baseUrl}PermissionMaster/Update`, payload);
    }

    updateRolepermission(payload: any, rolepagepermissionid: any): Observable<any> {
        payload['created_by'] = currentUser().user_id;
        return this.httpClient.put(`${this.baseUrl}rolePagePermissionMaster/${rolepagepermissionid}`, payload);
    }

    // --------------------------------------
    // Secured APIs: Encrypted table permission operations
    // --------------------------------------

    /**
     * Create role-permission mapping with encrypted payload and token header
     */
    createRolepermissionForTable(payload: any): Observable<any> {
        const Authorization = new EncryptedStorage().findItemFromAllStorage(
            new GlobalConfig().authToken
        );
        const headers = new HttpHeaders({
            'x-access-token': Authorization ? Authorization : ''
        });

        payload['created_by'] = currentUser().user_id;
        const newRes = new EncryptionAPILayer().encryptData(payload);
        const data = { reqBody: newRes };

        return this.httpClient.post(`${this.baseUrl}rolePagePermissionMaster/`, data, { headers });
    }

    /**
     * Update role-permission mapping with encrypted payload and token header
     */
    updateRolepermissionForTable(payload: any, rolepagepermissionid: any): Observable<any> {
        const Authorization = new EncryptedStorage().findItemFromAllStorage(
            new GlobalConfig().authToken
        );
        const headers = new HttpHeaders({
            'x-access-token': Authorization ? Authorization : ''
        });

        payload['created_by'] = currentUser().user_id;
        const newRes = new EncryptionAPILayer().encryptData(payload);
        const data = { reqBody: newRes };

        return this.httpClient.put(`${this.baseUrl}group-role-page-permission/${rolepagepermissionid}/`, data, { headers });
    }

    /**
     * Get all page-permission mappings using secure token header
     */
    getAllPagePermissionForTable(): Observable<any> {
        const Authorization = new EncryptedStorage().findItemFromAllStorage(
            new GlobalConfig().authToken
        );
        const headers = new HttpHeaders({
            'x-access-token': Authorization ? Authorization : ''
        });
        return this.httpClient.get(`${this.baseUrl}page-permission/`, { headers });
    }

    /**
     * Public access (non-authenticated) version of getAllPagePermission
     */
    getAllPagePermissionForTableUser(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}page-permission/`);
    }
}
