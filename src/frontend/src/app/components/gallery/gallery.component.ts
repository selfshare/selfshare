import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GalleryService} from '../../service/gallery/gallery.service';
import {IGallery} from '../../entity/IGallery';
import {IImage} from '../../entity/IImage';
import {ImageService} from '../../service/image/image.service';
import {Location} from '@angular/common';
import * as jQuery from 'jquery';

declare var $: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  gallery: IGallery = {images: [], gallery_id: 0, order_nr: 0, base64: '', title: '', description: ''};
  images: IImage[] = [];
  currentImage: IImage = {order_nr: 0, description: '', gallery_id: 0, image_id: 0, tag: '', title: '', upload_timestamp: 0, base64: ''};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private galleryService: GalleryService,
    private imageService: ImageService,
    private location: Location
  ) {
  }

  ngOnInit(): void {

    const galleryTitle = this.route.snapshot.paramMap.get('title');
    const imageId = this.route.snapshot.paramMap.get('imageId');

    this.galleryService.getGalleryByTitle(galleryTitle).subscribe(gallery => {
      this.gallery = gallery;
      this.loadImages(galleryTitle, imageId);
    }, error => {
      if (error.status === 404) {
        console.log(error.statusText);
        this.router.navigate(['/']);
      }
    });
  }

  private loadImages(galleryTitle: string, imageId: string): void {
    this.imageService.getMediumImagesByGalleryId(this.gallery.gallery_id).subscribe(images => {
      this.images = images;
      this.hideSpinner();
      this.checkIfEmptyShowText();

      if (imageId != null){
        if (this.images.find(i => i.image_id.toString() === imageId)){
          this.setCurrentImage(Number(imageId));
          $('#largeImageModal').modal('show');
        }else{
          this.location.go(galleryTitle);
        }
      }
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

  private setCurrentImage(imageId: number): void {
    this.currentImage = this.images.find(value => value.image_id === imageId);
    this.imageService.getLargeImageById(imageId).subscribe(image => {
      this.currentImage = image;
    });
  }

  private openLargeImage(imageId: number): void {
    this.currentImage = this.images.find(value => value.image_id === imageId);
    this.imageService.getLargeImageById(imageId).subscribe(image => {
      this.currentImage = image;
      this.location.go(this.location.path() + '/' + image.image_id);
    });
  }
}
