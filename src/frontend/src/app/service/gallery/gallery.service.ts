import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {IGallery} from '../../entity/IGallery';
import {IImage} from '../../entity/IImage';

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

  addGallery(gallery: IGallery): Observable<object> {
    return this.http.post<object>(this.url, gallery);
  }

  updateGalleryById(id: number, gallery: IGallery): Observable<object> {
    return this.http.put<object>(this.url + '/' + id, gallery);
  }

  setGalleryThumbnailById(id: number, image: IImage): Observable<object>  {
    return this.http.put<object>(this.url + '/thumbnail/' + id, image);
  }

  deleteGalleryById(id: number): Observable<object> {
    return this.http.delete<object>(this.url + '/' + id);
  }
}
