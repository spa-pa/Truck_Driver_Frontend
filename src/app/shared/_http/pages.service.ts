import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";


@Injectable({
  providedIn: "root"
})

export class PageService {

  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.API_BASE_URL;
  }

  getAllPage(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}PageMaster/`);
  }

  createPage(payload: any): Observable<any> {
    payload['created_by'] = currentUser().user_id
    return this.httpClient.post(`${this.baseUrl}PageMaster/`, payload);
  }

  getPage(id: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}PageMaster/${id}`);
  }

  updatePage(payload: any, id: any): Observable<any> {
    payload['modified_by'] = currentUser().user_id
    return this.httpClient.put(`${this.baseUrl}PageMaster/${id}`, payload);
  }

  deletePageById(pageId: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}PageMaster/${pageId}/`);
  }

}
