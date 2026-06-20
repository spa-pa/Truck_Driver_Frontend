import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { currentUser } from "@shared/utils/current-user";
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  baseUrl: string;

  constructor(private httpClient: HttpClient) {
      this.baseUrl = environment.API_BASE_URL;
  }

  getAllPermissions(): Observable<any> {
      return this.httpClient.get(`${this.baseUrl}permissions`);
  }

  getPermissions(id: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}permissions/${id}`);
}

  createPermissions(payload: any): Observable<any> {
    payload['created_by'] = currentUser().user_id
    return this.httpClient.post(`${this.baseUrl}permissions`, payload);
  }

  updatePermissions(payload: any, id: any): Observable<any> {
      payload['modified_by'] = currentUser().user_id
      return this.httpClient.put(`${this.baseUrl}permissions/${id}`, payload);
  }
}
