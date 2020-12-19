import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IAbout} from '../../entity/IAbout';
import {IResponse} from "../../entity/IResponse";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private url = environment.backend_url;

  constructor(private http: HttpClient) {
  }

  getAboutInformation(): Observable<IAbout> {
    return this.http.get<IAbout>(this.url + '/about');
  }

  updateAboutInformation(about: IAbout): Observable<object> {
    return this.http.put<IAbout>(this.url + '/about', about);
  }

  getDisclaimerInformation(): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/disclaimer');
  }

  updateDisclaimerInformation(disclaimer: IResponse): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/disclaimer', disclaimer);
  }
}
