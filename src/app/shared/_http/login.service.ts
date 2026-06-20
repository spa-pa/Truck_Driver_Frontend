import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { ILogin } from "@shared/models/login";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class LoginService {
    private baseUrl: string

    constructor(private http: HttpClient) {
        this.baseUrl = environment.API_BASE_URL
    }

    login(userInfo: ILogin): Observable<any> {
        return this.http.post(this.baseUrl + "auth/login/", userInfo)
    }

    loginEncryption(resBody: any): Observable<any> {
        return this.http.post(this.baseUrl + "auth", resBody)
    }

    getPermissiologin(id: any): Observable<any> {
        return this.http.get(`${this.baseUrl}role-page-permissions/getData/byRole/${id}`)
    }

}