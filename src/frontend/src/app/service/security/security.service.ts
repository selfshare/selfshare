import {ElementRef, Injectable} from '@angular/core';
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

  checkInputValid(
    security: ISecurity,
    repeatPassword: ElementRef):
    { valid: boolean; hideUsernameError: string; hideRepeatError: string; hidePasswordError: string } {

    let valid = true;
    let hideUsernameError = 'hidden';
    let hidePasswordError = 'hidden';
    let hideRepeatError = 'hidden';

    if (security.username == null || security.username.length === 0) {
      hideUsernameError = '';
      valid = false;
    }
    if (security.password == null || security.password.length < 8) {
      hidePasswordError = '';
      valid = false;

    }
    if (repeatPassword.nativeElement.value == null || repeatPassword.nativeElement.value !== security.password) {
      hideRepeatError = '';
      valid = false;
    }
    return {
      valid,
      hideUsernameError,
      hidePasswordError,
      hideRepeatError
    };
  }
}
