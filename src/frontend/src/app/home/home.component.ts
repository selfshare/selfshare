import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GalleryService} from '../service/gallery.service';
import {IGallery} from '../entity/IGallery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  constructor(private galleryService: GalleryService) { }

  galleries: IGallery[];
  images = ['/assets/IMG_20200919_181732.jpg', '/assets/IMG_20200913_151547.jpg', '/assets/DSC_0052.JPG'];

  ngOnInit(): void {
    this.galleryService.getAllGalleries().subscribe(galleries => {
      this.galleries = galleries;
    });

    window.addEventListener('resize', ev => {
      this.resizeImages();
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


  getGalleryTitleAndResize(galleryIndex: number): string {
    if (galleryIndex === 0){
      this.resizeImages();
    }
    return this.galleries[galleryIndex].title;
  }
}
