import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {IGallery} from '../../entity/IGallery';
import {IImage} from '../../entity/IImage';
import {IResponse} from "../../entity/IResponse";

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

  addGallery(gallery: IGallery): Observable<IResponse> {
    return this.http.post<IResponse>(this.url, gallery);
  }

  updateGalleryById(id: number, gallery: IGallery): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/' + id, gallery);
  }

  setGalleryThumbnailById(id: number, image: IImage): Observable<IResponse>  {
    return this.http.put<IResponse>(this.url + '/thumbnail/' + id, image);
  }

  deleteGalleryById(id: number): Observable<IResponse> {
    return this.http.delete<IResponse>(this.url + '/' + id);
  }
}
