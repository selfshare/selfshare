import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {IAbout} from "../../entity/IAbout";
import {Observable} from "rxjs";
import {ISecurity} from "../../entity/ISecurity";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private url = environment.backend_url + '/security';

  constructor(private http: HttpClient) {
  }

  login(security: ISecurity): Observable<object> {
    return this.http.post<ISecurity>(this.url, security);
  }

  updateSecurityInformation(security: ISecurity): Observable<object> {
    return this.http.put<ISecurity>(this.url, security);
  }
}
