import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {IAbout} from "../../entity/IAbout";

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
    return this.http.put<object>(this.url + '/about', about);
  }
}
