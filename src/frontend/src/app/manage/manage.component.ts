import { Component, OnInit } from '@angular/core';
import {IGallery} from '../entity/IGallery';
import {GalleryService} from '../service/gallery/gallery.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  constructor(private galleryService: GalleryService) { }

  galleries: IGallery[];

  ngOnInit(): void {
    this.galleryService.getAllGalleries().subscribe(galleries => {
      this.galleries = galleries.sort((a, b) => a.order_nr - b.order_nr);
    });
  }

}
