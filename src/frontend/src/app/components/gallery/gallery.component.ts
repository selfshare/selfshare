import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GalleryService} from '../../service/gallery/gallery.service';
import {IGallery} from '../../entity/IGallery';
import {IImage} from '../../entity/IImage';
import {ImageService} from '../../service/image/image.service';
import {Location} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  @ViewChild('emptyText') emptyText: ElementRef;
  @ViewChild('loadingSpinner') loadingSpinner: ElementRef;

  gallery: IGallery = {} as IGallery;
  images: IImage[] = [];
  currentImage = {} as IImage;

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
        this.router.navigate(['/']).then();
      }
    });
  }

  private loadImages(galleryTitle: string, imageId: string): void {
    this.imageService.getMediumImagesByGalleryId(this.gallery.gallery_id).subscribe(images => {
      this.images = images;
      this.hideSpinner();
      this.checkIfEmptyShowText();

      if (imageId != null) {
        if (this.images.find(i => i.image_id.toString() === imageId)) {
          this.setCurrentImage(Number(imageId));
          $('#largeImageModal').modal('show');
        } else {
          this.location.go(galleryTitle);
        }
      }
    });
  }

  private hideSpinner(): void {
    this.loadingSpinner.nativeElement.style.display = 'none';
  }

  private checkIfEmptyShowText(): void {
    if (this.images.length === 0) {
      this.emptyText.nativeElement.style.display = 'block';
    }
  }

  private setCurrentImage(imageId: number): void {
    this.currentImage = this.images.find(value => value.image_id === imageId);
    this.imageService.getLargeImageById(imageId).subscribe(image => {
      this.currentImage = image;
    });
  }

  openLargeImage(imageId: number): void {
    this.currentImage = this.images.find(value => value.image_id === imageId);
    this.imageService.getLargeImageById(imageId).subscribe(image => {
      this.currentImage = image;
      this.location.go(this.location.path() + '/' + image.image_id);
    });
  }
}
