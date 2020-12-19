import {Component, OnInit} from '@angular/core';
import {GalleryService} from '../../service/gallery/gallery.service';
import {IGallery} from '../../entity/IGallery';
import {GeneralService} from "../../service/general/general.service";
import {IGeneral} from "../../entity/IGeneral";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  constructor(private galleryService: GalleryService, private generalService: GeneralService) {
  }

  galleries: IGallery[];
  general = {} as IGeneral;

  ngOnInit(): void {
    this.generalService.getGeneralInformation().subscribe(general => {
      this.general = general;
    });

    this.galleryService.getAllGalleriesMedium().subscribe(galleries => {
      this.galleries = galleries;
      this.hideSpinner();
      this.checkIfEmptyShowText();
    });

    window.addEventListener('resize', ev => {
      this.resizeImages();
    });
  }

  private resizeImages(): void {
    const cardWidth: number = document.getElementsByClassName('card')[0].clientWidth;
    const galleryImages: any = document.querySelectorAll('.modalImage');
    galleryImages.forEach((img) => {
      img.style.minHeight = cardWidth + 'px';
      img.style.maxHeight = cardWidth + 'px';
    });
  }


  getGalleryTitleAndResize(galleryIndex: number): string {
    if (galleryIndex === 0) {
      //this.resizeImages();
    }
    return this.galleries[galleryIndex].title;
  }

  private hideSpinner(): void {
    const spinner: any = document.getElementById('loading-spinner');
    spinner.style.display = 'none';
  }

  private checkIfEmptyShowText(): void {
    if (this.galleries.length === 0) {
      const text: any = document.getElementById('emptyText');
      text.style.display = 'block';
    }
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
}
