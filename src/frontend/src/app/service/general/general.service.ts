import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IAbout} from '../../entity/IAbout';
import {IGeneral} from '../../entity/IGeneral';
import {IResponse} from '../../entity/IResponse';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private general = {} as IGeneral;

  private url = environment.backend_url;

  constructor(private http: HttpClient) {
  }

  getAboutInformation(): Observable<IAbout> {
    return this.http.get<IAbout>(this.url + '/about');
  }

  updateAboutInformation(about: IAbout): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/about', about);
  }

  getGeneralInformation(): Observable<IGeneral>{
    return this.http.get<IGeneral>(this.url + '/general');
  }

  updateGeneralInformation(general: IGeneral): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/general', general);
  }
}
