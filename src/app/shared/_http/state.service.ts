import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class StateService {
    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllState(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}StateMaster`);
    }

    getState(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}StateMaster/${id}`);
    }

    createState(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}StateMaster/`, payload);
    }

    updateState(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}StateMaster/${id}`, payload);
    }

    deleteState(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}StateMaster/${id}`);
    }
}