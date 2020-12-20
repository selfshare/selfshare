import {Component, OnInit} from '@angular/core';
import {GalleryService} from '../../../service/gallery/gallery.service';
import {IGallery} from '../../../entity/IGallery';
import {ImageService} from '../../../service/image/image.service';
import {IImage} from '../../../entity/IImage';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {

  galleries: IGallery[] = [];
  currentGallery: IGallery = {} as IGallery;

  addGalleryTitle = '';
  addGalleryDesc = '';

  editTitle = '';
  editDesc = '';

  constructor(private galleryService: GalleryService, private imageService: ImageService) {
  }

  ngOnInit(): void {
    this.loadGalleries();
  }

  private loadGalleries(): void {
    this.galleryService.getAllGalleriesSmall().subscribe(galleries => {
      this.galleries = galleries.sort((a, b) => a.order_nr - b.order_nr);
      this.currentGallery = {} as IGallery;
      this.galleries.forEach(gallery => {
        this.getImagesByGallery(gallery);
      });
    });
  }

  /*
    Updates every gallery one by one instead of all to prevent closing of the accordion.
   */
  private updateGalleries(): void {
    this.galleryService.getAllGalleriesSmall().subscribe(galleries => {
      galleries = galleries.sort((a, b) => a.order_nr - b.order_nr);

      // reset
      this.currentGallery = {} as IGallery;

      let counter = 0;
      galleries.forEach(gallery => {
        Object.assign(this.galleries[counter++], gallery);
        this.getImagesByGallery(gallery);
      });
    });
  }

  private getImagesByGallery(gallery: IGallery): void {
    this.imageService.getSmallImagesByGalleryId(gallery.gallery_id).subscribe(images => {
      this.galleries.find(value => value.gallery_id === gallery.gallery_id).images = images;
    });
  }

  changeCurrentGallery(gallery: IGallery): void {
    this.currentGallery = gallery;
  }

  deleteImage(id: number): void {
    this.imageService.deleteImageById(id).subscribe(code => {
      console.log(code);
      this.updateGalleries();
    });
  }

  addGallery(): void {
    if (this.addGalleryTitle.length >= 1 && this.addGalleryTitle.match(/^[a-zA-Z0-9]+$/)) {
      const gallery = {} as IGallery;
      gallery.title = this.addGalleryTitle;
      gallery.description = this.addGalleryDesc;

      this.galleryService.addGallery(gallery).subscribe(response => {
        console.log(response.code);
        this.loadGalleries();
        this.addGalleryTitle = '';
        this.addGalleryDesc = '';
      });
    }

  }

  updateGalleryChanges(): void {
    this.galleryService.updateGalleryById(this.currentGallery.gallery_id, this.currentGallery).subscribe(() => {
      this.loadGalleries();
    });
  }

  moveGalleryUp(gallery: IGallery): void {
    if (!this.isGalleryAtTop(gallery)) {
      this.currentGallery = gallery;
      this.currentGallery.order_nr = gallery.order_nr - 1;
      this.updateGalleryChanges();
    }
  }

  moveGalleryDown(gallery: IGallery): void {
    if (!this.isGalleryAtBottom(gallery)) {
      this.currentGallery = gallery;
      this.currentGallery.order_nr = gallery.order_nr + 1;
      this.updateGalleryChanges();
    }
  }

  isGalleryAtBottom(gallery: IGallery): boolean {
    return gallery.order_nr === this.galleries.length - 1;
  }

  isGalleryAtTop = (gallery: IGallery): boolean => gallery.order_nr === 0;

  getGalleryImage(gallery: IGallery): string {
    if (gallery.base64 == null) {
      return '';
    }
    if (gallery.base64.match(/data:image(.)*;base64/)) {
      return gallery.base64;
    } else {
      return '';
    }
  }

  showGalleryImage(gallery: IGallery): string {
    if (gallery.base64 == null) {
      return 'visibility: hidden';
    }
    if (gallery.base64.match(/data:image(.)*;base64/)) {
      return 'visibility: visible';
    } else {
      return 'visibility: hidden';
    }
  }

  setAsGalleryImage(gallery: IGallery, image: IImage): void {
    this.galleryService.setGalleryThumbnailById(gallery.gallery_id, image).subscribe(code => {
      console.log(code);
      this.updateGalleries();
    });
  }

  isNotClickableUp(gallery: IGallery): string {
    return this.isGalleryAtBottom(gallery) ? 'unclickable' : '';
  }

  isNotClickableDown(gallery: IGallery): string {
    return this.isGalleryAtTop(gallery) ? 'unclickable' : '';
  }

  deleteGallery(gallery: IGallery): void {
    this.galleryService.deleteGalleryById(gallery.gallery_id).subscribe(code => {
      console.log(code);
      this.loadGalleries();
    });
  }

  resetEditMode(): void {
    document.querySelectorAll('.edit-row').forEach(row => {
      row.classList.add('hidden');
    });
    document.querySelectorAll('.default-row').forEach(row => {
      row.classList.remove('hidden');
    });
  }

  editGallery(gallery: IGallery): void {
    this.resetEditMode();
    this.editTitle = gallery.title;
    this.editDesc = gallery.description;

    document.getElementById('gallery_row_default_' + gallery.gallery_id).classList.add('hidden');
    document.getElementById('gallery_row_edit_' + gallery.gallery_id).classList.remove('hidden');
  }

  editImage(image: IImage): void {
    this.resetEditMode();
    this.editTitle = image.title;
    this.editDesc = image.description;

    document.getElementById('image_row_default_' + image.image_id).classList.add('hidden');
    document.getElementById('image_row_edit_' + image.image_id).classList.remove('hidden');
  }

  editGalleryExit(save: boolean, gallery: IGallery): void {
    document.getElementById('gallery_row_default_' + gallery.gallery_id).classList.remove('hidden');
    document.getElementById('gallery_row_edit_' + gallery.gallery_id).classList.add('hidden');
    console.log(this.currentGallery);

    if (save) {
      if (this.editTitle.length >= 1 && this.editTitle.match(/^[a-zA-Z0-9]+$/)) {
        const newGallery: IGallery = {
          base64: '',
          description: this.editDesc,
          gallery_id: gallery.gallery_id,
          images: [],
          order_nr: gallery.order_nr,
          title: this.editTitle
        };

        this.galleryService.updateGalleryById(newGallery.gallery_id, newGallery).subscribe(code => {
          console.log(code);
          this.loadGalleries();
        });
      }
    }
  }

  editImageExit(save: boolean, image: IImage): void {
    document.getElementById('image_row_default_' + image.image_id).classList.remove('hidden');
    document.getElementById('image_row_edit_' + image.image_id).classList.add('hidden');

    if (save) {
      if (this.editTitle.length >= 1 && this.editTitle.match(/^[a-zA-Z0-9]+$/)) {
        const newImage = {} as IImage;
        Object.assign(newImage, image);
        newImage.base64 = null;
        console.log(newImage);

        this.imageService.updateImageById(newImage.gallery_id, newImage).subscribe(code => {
          console.log(code);
          this.updateGalleries();
        });
      }
    }
  }

  getImageCount(gallery: IGallery): number {
    if (gallery.images == null) {
      return 0;
    }
    return gallery.images.length;

  }

  isImageNotClickableUp(image: IImage): string {
    return this.isImageAtBottom(image) ? 'unclickable' : '';
  }

  isImageNotClickableDown(image: IImage): string {
    return this.isImageAtTop(image) ? 'unclickable' : '';
  }

  moveImageDown(image: IImage): void {
    if (!this.isImageAtBottom(image)) {
      image.order_nr = image.order_nr - 1;
      this.imageService.updateImageById(image.image_id, image).subscribe(code => {
        console.log(code);
        this.updateGalleries();
      });
    }
  }

  moveImageUp(image: IImage): void {
    if (!this.isImageAtTop(image)) {
      image.order_nr = image.order_nr + 1;
      this.imageService.updateImageById(image.image_id, image).subscribe(code => {
        console.log(code);
        this.updateGalleries();
      });
    }
  }

  private isImageAtBottom = (image: IImage): boolean => image.order_nr === 0;

  private isImageAtTop(image: IImage): boolean {
    return image.order_nr === this.galleries.find(gal => gal.gallery_id === image.gallery_id).images.length - 1;
  }
}
