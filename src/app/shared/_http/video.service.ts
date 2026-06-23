import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private baseUrl: string

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.API_BASE_URL
  }
  getAllVideos(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}videoMaster`);
  }

  getVideoByLanguageId(id: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}videoMaster/language/${id}`);
  }

  createVideo(payload: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}videoMaster/`, payload);
  }

  updateVideo(payload: any, id: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}videoMaster/${id}`, payload);
  }

  deleteVideos(id: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}videoMaster/${id}`);
  }
}
