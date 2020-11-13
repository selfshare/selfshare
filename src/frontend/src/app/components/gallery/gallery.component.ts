import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GalleryService} from '../../service/gallery/gallery.service';
import {IGallery} from '../../entity/IGallery';
import {IImage} from '../../entity/IImage';
import {ImageService} from '../../service/image/image.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  gallery: IGallery = {images: [], gallery_id: 0, order_nr: 0, thumbnail_base64: '', title: '', description: ''};
  images: IImage[] = [];

  constructor(
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private imageService: ImageService
  ) {
  }

  ngOnInit(): void {
    const galleryTitle = this.route.snapshot.paramMap.get('title');

    this.galleryService.getGalleryByTitle(galleryTitle).subscribe(gallery => {
      this.gallery = gallery;
      this.loadImages();
    }, error => {
      if (error.status === 404) {
        console.log(error.statusText);
      }
    });
  }

  private loadImages(): void {
    this.imageService.getImagesByGalleryId(this.gallery.gallery_id).subscribe(images => {
      this.images = images;
      this.hideSpinner();
      this.checkIfEmptyShowText();
    });
  }

  resizeImages(): void {
    const cardWidth: number = document.getElementsByClassName('card')[0].clientWidth;
    const galleryImages: any = document.querySelectorAll('.modalImage');
    galleryImages.forEach((img) => {
      img.style.minHeight = cardWidth + 'px';
      img.style.maxHeight = cardWidth + 'px';
    });
  }

  private getImageTitleAndResize(imageIndex: number): string {
    if (imageIndex === 0){
      this.resizeImages();
    }
    return this.images[imageIndex].title;
  }

  private hideSpinner(): void{
    const spinner: any = document.getElementById('loading-spinner');
    spinner.style.display = 'none';
  }

  private checkIfEmptyShowText(): void{
    if (this.images.length === 0){
      const text: any = document.getElementById('emptyText');
      text.style.display = 'block';
    }
  }

}
