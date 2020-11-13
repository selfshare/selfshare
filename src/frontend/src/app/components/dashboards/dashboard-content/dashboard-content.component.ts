import {Component, OnInit, ViewChild} from '@angular/core';
import {GalleryService} from '../../../service/gallery/gallery.service';
import {IGallery} from '../../../entity/IGallery';
import {ImageService} from '../../../service/image/image.service';
import {AddImageDialogComponent} from '../../../add-image-dialog/add-image-dialog.component';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent implements OnInit {

  galleries: IGallery[] = [];
  currentGallery: IGallery = {description: '', gallery_id: 0, images: [], order_nr: 0, thumbnail_base64: '', title: ''};

  constructor(private galleryService: GalleryService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.galleryService.getAllGalleries().subscribe(galleries => {
      this.galleries = galleries.sort((a, b) => a.order_nr - b.order_nr);

      this.galleries.forEach(gallery => {
        this.getImagesByGallery(gallery);
      });
    });
  }

  getImagesByGallery(gallery: IGallery): void {
    this.imageService.getImagesByGalleryId(gallery.gallery_id).subscribe(images => {
        gallery.images = images;
    });
  }

  changeCurrentGallery(gallery: IGallery): void {
    this.currentGallery = gallery;
  }
}
