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
  galleryOrders = new Map();
  currentGallery: IGallery = {} as IGallery;

  addGalleryTitle = '';
  addGalleryDesc = '';

  editTitle = '';
  editDesc = '';

  minOrderNr: number;
  maxOrderNr: number;

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
        this.calculateMinMaxAndGetImages(gallery);
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
      this.minOrderNr = null;
      this.maxOrderNr = null;
      //this.galleryOrders.clear();

      let counter = 0;
      galleries.forEach(gallery => {
        Object.assign(this.galleries[counter++], gallery);
        this.calculateMinMaxAndGetImages(gallery);
      });
    });
  }

  private calculateMinMaxAndGetImages(gallery: IGallery): void{
    this.minOrderNr = Math.min(this.minOrderNr != null ? this.minOrderNr : gallery.order_nr, gallery.order_nr);
    this.maxOrderNr = Math.max(this.maxOrderNr != null ? this.maxOrderNr : gallery.order_nr, gallery.order_nr);
    this.getImagesByGallery(gallery);
  }

  private getImagesByGallery(gallery: IGallery): void {
    this.imageService.getSmallImagesByGalleryId(gallery.gallery_id).subscribe(images => {
      this.galleries.find(value => value.gallery_id === gallery.gallery_id).images = images;
      images.forEach(image => {

        const minExists = this.galleryOrders.has(gallery.gallery_id) ? this.galleryOrders.get(gallery.gallery_id).min : image.order_nr;
        const maxExists = this.galleryOrders.has(gallery.gallery_id) ? this.galleryOrders.get(gallery.gallery_id).max : image.order_nr;

        const min = Math.min(minExists, image.order_nr);
        const max = Math.max(maxExists, image.order_nr);

        this.galleryOrders.set(gallery.gallery_id, {min, max});

      });
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
    const gallery = {} as IGallery;
    gallery.title = this.addGalleryTitle;
    gallery.description = this.addGalleryDesc;

    this.galleryService.addGallery(gallery).subscribe(resp => {
      this.loadGalleries();
      this.addGalleryTitle = '';
      this.addGalleryDesc = '';
    });
  }

  updateGalleryChanges(): void {
    this.galleryService.updateGalleryById(this.currentGallery.gallery_id, this.currentGallery).subscribe(resp => {
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
    return gallery.order_nr === this.maxOrderNr;
  }

  isGalleryAtTop(gallery: IGallery): boolean {
    return gallery.order_nr === this.minOrderNr;
  }

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
      this.loadGalleries();
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

  editImageExit(save: boolean, image: IImage): void {
    document.getElementById('image_row_default_' + image.image_id).classList.remove('hidden');
    document.getElementById('image_row_edit_' + image.image_id).classList.add('hidden');

    if (save) {
      const newImage: IImage = {
        tag: '',
        upload_timestamp: image.upload_timestamp,
        base64: null,
        gallery_id: image.gallery_id,
        image_id: image.image_id,
        order_nr: image.order_nr,
        title: this.editTitle,
        description: this.editDesc
      };
      console.log(newImage);

      this.imageService.updateImageById(newImage.gallery_id, newImage).subscribe(code => {
        console.log(code);
        this.loadGalleries();
      });
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

  private isImageAtBottom(image: IImage): boolean {
    return image.order_nr === this.galleryOrders.get(image.gallery_id).min;
  }

  private isImageAtTop(image: IImage): boolean {
    return image.order_nr === this.galleryOrders.get(image.gallery_id).max;
  }
}
