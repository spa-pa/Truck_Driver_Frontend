import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class DriverCertificationService {
  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.API_BASE_URL;
  }

  getAllDriverCertification(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}driverCertification/`);
  }

  getDriverCertificationByCertificationId(id: any): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}driverCertification/certification/${id}`,
    );
  }

  createDriverCertification(payload: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}driverCertification/`, payload);
  }

  updateDriverCertification(payload: any, id: any): Observable<any> {
    return this.httpClient.put(
      `${this.baseUrl}driverCertification/${id}`,
      payload,
    );
  }

  deleteDriverCertification(id: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}driverCertification/${id}`);
  }

  searchDriverCertification(params: {
    mobileNo?: string;
    licenseNo?: string;
  }): Observable<any> {
    let httpParams = new HttpParams();
    if (params.mobileNo) {
      httpParams = httpParams.set("mobileNo", params.mobileNo.trim());
    }
    if (params.licenseNo) {
      httpParams = httpParams.set("licenseNo", params.licenseNo.trim());
    }

    return this.httpClient.get(`${this.baseUrl}driverCertification/search`, {
      params: httpParams,
    });
  }

  searchByMobile(mobileNo: string): Observable<any> {
    const params = new HttpParams().set("mobileNo", mobileNo.trim());
    return this.httpClient.get(`${this.baseUrl}driverCertification/search`, {
      params,
    });
  }

  searchByLicense(licenseNo: string): Observable<any> {
    const params = new HttpParams().set("licenseNo", licenseNo.trim());
    return this.httpClient.get(`${this.baseUrl}driverCertification/search`, {
      params,
    });
  }
}
