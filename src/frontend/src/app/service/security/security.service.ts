import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ISecurity} from '../../entity/ISecurity';
import {IResponse} from '../../entity/IResponse';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private url = environment.backend_url + '/security';

  constructor(private http: HttpClient) {
  }

  login(security: ISecurity): Observable<IResponse> {
    const headers = new HttpHeaders({Authorization: 'Basic ' + btoa(security.username + ':' + security.password)});
    return this.http.get<IResponse>(this.url + '/login', {headers});
  }

  updateSecurityInformation(security: ISecurity): Observable<IResponse> {
    return this.http.put<IResponse>(this.url, security);
  }

  authenticate(): Observable<IResponse> {
    const hash = localStorage.getItem('loginHash');
    if (hash != null) {
      const headers = new HttpHeaders({Authorization: 'Bearer ' + btoa(hash)});
      return this.http.get<IResponse>(this.url + '/auth', {headers});
    }
    return of({code: 401, body: null});
  }

  checkSetupAvailable(): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/setup');
  }
}
