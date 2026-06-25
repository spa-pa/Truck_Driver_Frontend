import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class DashboardService {
    private baseUrl: string

    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    getDashboardCount(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}dashboard/counts`);
    }
}