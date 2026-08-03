import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PosterService {
        private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllPosters(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}posterMaster`);
    }

    createPoster(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}posterMaster`, payload);
    }

    getPosterById(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}posterMaster/${id}`);
    }

    getPosterByLanguageId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}posterMaster/language/${id}`);
    }

    updatePoster(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}posterMaster/${id}`, payload);
    }

    deletePoster(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}posterMaster/${id}`);
    }
}
