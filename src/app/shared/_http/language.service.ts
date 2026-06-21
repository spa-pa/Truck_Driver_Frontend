import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllLanguages(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}languageMaster`);
    }

    getByLanguageId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}languageMaster/${id}`);
    }

    createLanguage(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}languageMaster/`, payload);
    }

    updateLanguage(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}languageMaster/${id}`, payload);
    }

    deleteLanguage(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}languageMaster/${id}`);
    }
}
