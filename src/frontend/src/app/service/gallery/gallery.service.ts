import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {IGallery} from '../../entity/IGallery';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private url = environment.backend_url + '/gallery';

  constructor(private http: HttpClient) { }

  getAllGalleriesMedium(): Observable<IGallery[]> {
    return this.http.get<IGallery[]>(this.url + '/m');
  }

  getAllGalleriesSmall(): Observable<IGallery[]> {
    return this.http.get<IGallery[]>(this.url + '/s');
  }

  getGalleryByTitle(name: string): Observable<IGallery> {
    return this.http.get<IGallery>(this.url + '/info/' + name);
  }
}
