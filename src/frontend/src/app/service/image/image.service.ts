import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IImage} from '../../entity/IImage';
import {IResponse} from '../../entity/IResponse';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private url = environment.backend_url + '/image';

  constructor(private http: HttpClient) { }

  getLargeImageById(id: number): Observable<IImage> {
    return this.http.get<IImage>(this.url + '/l/' + id);
  }

  getMediumImagesByGalleryId(id: number): Observable<IImage[]> {
    return this.http.get<IImage[]>(this.url + '/m/' + id);
  }

  getSmallImagesByGalleryId(id: number): Observable<IImage[]> {
    return this.http.get<IImage[]>(this.url + '/s/' + id);
  }

  uploadImage(image: IImage): Observable<IResponse>{
    return this.http.post<IResponse>(this.url, image);
  }

  deleteImageById(id: number): Observable<IResponse>{
    return this.http.delete<IResponse>(this.url + '/' + id);
  }

  updateImageById(id: number, image: IImage): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/' + id, image);
  }

  compressImage(base64: string, size: number, callback: any): any {
    const canvas = document.createElement('canvas');
    canvas.height = size;
    canvas.width = size;
    canvas.style.display = 'none';
    const context = canvas.getContext('2d');
    const image = new Image();

    image.src = base64;
    image.onload = () => {
      if (image.width > image.height) {
        const ratio = size / image.height;
        const width = image.width * ratio;
        const startX = (width - size) / 2;
        context.drawImage(image, -startX, 0, width, size);
        return callback(canvas.toDataURL());
      } else {
        const ratio = size / image.width;
        const height = image.height * ratio;
        const startY = (height - size) / 2;
        context.drawImage(image, 0, -startY, size, height);
        return callback(canvas.toDataURL());
      }
    };
  }
}
