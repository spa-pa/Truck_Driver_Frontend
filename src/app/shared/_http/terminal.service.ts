import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TerminalService {

    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllTerminals(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}terminalMaster/getAllTerminals`);
    }

    getTerminalById(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}terminalMaster/getTerminalById/${id}`);
    }

    createTerminal(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}terminalMaster/createTerminal/`, payload);
    }

    updateTerminal(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}terminalMaster/updateTerminal/${id}`, payload);
    }

    deleteTerminal(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}terminalMaster/deleteTerminal/${id}`);
    }
}
