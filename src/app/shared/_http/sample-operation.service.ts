import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class SampleOperationService {
  baseUrl: string;
  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.API_BASE_URL;
};

getAllSampleOperationData():Observable<any>{
    return this.httpClient.get(`${this.baseUrl}sample`)
};

getSampleOperationDataById(sample_id:any):Observable<any>{
  return this.httpClient.get(`${this.baseUrl}sample/getbyId?sampleId=${sample_id}`)
};

createOrUpdate(payload:any){
  return this.httpClient.put(`${this.baseUrl}sample/create/update/sample`,payload)
}






}