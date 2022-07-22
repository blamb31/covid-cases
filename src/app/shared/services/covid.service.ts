import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private baseUrl = 'https://covid-api.mmediagroup.fr/v1'
  constructor(private _http:HttpClient) { }

  getAllCases() {
    return this._http.get(`${this.baseUrl}/cases`)
  }
  getAllHistory() {
    return this._http.get(`${this.baseUrl}/history?status=deaths`)
  }
}
