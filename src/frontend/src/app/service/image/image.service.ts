import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IGallery} from '../../entity/IGallery';
import {IImage} from '../../entity/IImage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private url = environment.backend_url + '/image';

  constructor(private http: HttpClient) { }

  getImagesByGalleryId(id: number): Observable<IImage[]> {
    return this.http.get<IImage[]>(this.url + '/' + id);
  }
}
