import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class UserMasterService {
    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getAllUserMasterByTerminal(terminal_id: string): Observable<any> {
        const params = new HttpParams().set("terminal_id", terminal_id);
        return this.httpClient.get(`${this.baseUrl}auth`, {
            params,
        });
    }

    getAllUserMaster(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}auth`);
    }

    getUserMaster(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}auth/${id}`);
    }

    createUserMaster(payload: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}auth/`, payload);
    }

    updateUserMaster(payload: any, id: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}auth/${id}`, payload);
    }

    deleteUserMaster(id: any): Observable<any> {
        return this.httpClient.delete(`${this.baseUrl}auth/${id}`);
    }
}