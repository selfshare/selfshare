import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IAbout} from '../../entity/IAbout';
import {IResponse} from '../../entity/IResponse';
import {IGeneral} from '../../entity/IGeneral';

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

  updateAboutInformation(about: IAbout): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/about', about);
  }

  getGeneralInformation(): Observable<IGeneral> {
    return this.http.get<IGeneral>(this.url + '/general');
  }

  updateGeneralInformation(general: IGeneral): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/general', general);
  }

  getDisclaimerInformation(): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/disclaimer');
  }

  updateDisclaimerInformation(disclaimer: IResponse): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/disclaimer', disclaimer);
  }

  formatString(input: string): string {
    if (input) {
      let match;
      const htmlRegex = /<[^>]*>?/gm;

      let str = input.replace(htmlRegex, '');
      const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

      match = str.match(emailRegex);
      if (match != null) {
        do {
          input = input.replace(match[0], `<a href="mailto:${match[0]}">${match[0]}</a>`);
          str = str.substring(str.indexOf(match[0]) + match[0].length);
          match = str.match(emailRegex);
        } while (match != null);
      }

      str = input.replace(htmlRegex, '');
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

      match = str.match(urlRegex);
      if (match != null) {
        do {
          input = input.replace(match[0], `<a target="_blank" href="${match[0]}">${match[0]}</a>`);
          str = str.substring(str.indexOf(match[0]) + match[0].length);
          match = str.match(urlRegex);
        } while (match != null);
      }
    }
    return input;
  }
}
