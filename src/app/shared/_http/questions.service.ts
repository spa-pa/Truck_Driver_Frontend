import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class QuestionsService {
    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllquestions(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}questions`);
    }

    getquestionsByLanguageId(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}questions/language/${id}`);
    }

    createquestions(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}questions/`, payload);
    }

    updatequestions(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}questions/${id}`, payload);
    }

    deletequestions(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}questions/${id}`);
    }
}