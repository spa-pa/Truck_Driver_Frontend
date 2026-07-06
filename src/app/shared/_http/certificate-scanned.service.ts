import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CertificateScannedService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.API_BASE_URL;
  }

  // getAllCertificateScanned(): Observable<any> {
  //     return this.httpClient.get(`${this.baseUrl}certificateScanned`);
  // }

  getAllCertificateScanned(terminalId?: number | null): Observable<any> {
    let params = new HttpParams();
    if (terminalId != null) {
      params = params.set("terminal_id", terminalId.toString());
    }
    return this.httpClient.get(`${this.baseUrl}certificateScanned`, { params });
  }

  getByCountryId(id: any): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}certificateScanned/byCountry/${id}`,
    );
  }

  getCertificateScanned(id: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}certificateScanned/${id}`);
  }

  createCertificateScanned(payload: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}certificateScanned/`, payload);
  }

  updateCertificateScanned(payload: any, id: any): Observable<any> {
    return this.httpClient.put(
      `${this.baseUrl}certificateScanned/${id}`,
      payload,
    );
  }

  deleteCertificateScanned(id: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}certificateScanned/${id}`);
  }
}
