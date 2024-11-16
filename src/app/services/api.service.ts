import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl : string = import.meta.env.NG_APP_PUBLIC_API_SERVER_URL;
  constructor(private http: HttpClient) {
  }
  get(
    path: string,
    params: HttpParams = new HttpParams(),
    responseType = 'json'
  ): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`, {
      params: params,
      responseType: responseType as 'json',
    });
  }

  put(path: string, body: Object = {}): Observable<any> {
    const headers = this.getHeaders();
    const options = {
      headers: headers,
    };
    return this.http.put(
      `${this.apiUrl}${path}`,
      JSON.stringify(body),
      options
    );
  }

  postFormData(path: any, body: FormData): Observable<any> {
    const headers = this.getHeaders(true);
    const options = {
      headers: headers,
    };
    return this.http.post(`${this.apiUrl}${path}`, body, options);
  }

  post(
    path: string,
    body: Object = {},
    responseType = 'json'
  ): Observable<any> {
    const headers = this.getHeaders();
    const options = {
      headers: headers,
      responseType: responseType as 'json',
    };
    return this.http.post(
      `${this.apiUrl}${path}`,
      JSON.stringify(body),
      options
    );
  }

  delete(path: any): Observable<any> {
    const headers = this.getHeaders();
    const options = {
      headers: headers,
    };
    return this.http.delete(`${this.apiUrl}${path}`, options);
  }

  private getHeaders = (isFormDataRequest: boolean = false): HttpHeaders => {
    let headers = new HttpHeaders();
    if (!isFormDataRequest) {
      headers = headers.append(
        'Content-Type',
        'application/json ; charset=utf-8'
      );
    } else {
      //headers = headers.append('Content-Type', 'multipart/form-data');
    }
    headers = headers.append(
      'Accept',
      'application/json , text/javascript, */*; q=0.01'
    );
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return headers;
  };
}
