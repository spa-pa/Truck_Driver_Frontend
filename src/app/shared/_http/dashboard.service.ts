import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.API_BASE_URL;
  }

  //   getDashboardCount(): Observable<any> {
  //     return this.httpClient.get(`${this.baseUrl}dashboard/counts`);
  //   }

  getDashboardCount(terminalId?: number | null): Observable<any> {
    let params = new HttpParams();
    if (terminalId != null) {
      // ← catches undefined and null
      params = params.set("terminal_id", terminalId.toString());
    }
    return this.httpClient.get(`${this.baseUrl}dashboard/counts`, { params });
  }

  // getAllDriverCertificationsData(): Observable<any> {
  //   return this.httpClient.get(`${this.baseUrl}driverCertification`);
  // }

  getAllDriverCertification(terminalId?: number | null): Observable<any> {
    let params = new HttpParams();
    if (terminalId != null) {
      params = params.set("terminal_id", terminalId.toString());
    }
    return this.httpClient.get(`${this.baseUrl}driverCertification`, { params });
  }

  // getAllScannedCertificationsData(): Observable<any> {
  //     return this.httpClient.get(`${this.baseUrl}certificateScanned`);
  // }

  getAllScannedCertificationsData(terminalId?: number | null): Observable<any> {
    let params = new HttpParams();
    if (terminalId != null) {
      params = params.set("terminal_id", terminalId.toString());
    }
    return this.httpClient.get(`${this.baseUrl}certificateScanned`, { params });
  }
}
