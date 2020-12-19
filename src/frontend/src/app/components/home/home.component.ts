import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GalleryService} from '../../service/gallery/gallery.service';
import {IGallery} from '../../entity/IGallery';
import {GeneralService} from '../../service/general/general.service';
import {IGeneral} from '../../entity/IGeneral';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(private galleryService: GalleryService, private generalService: GeneralService) {
  }

  @ViewChild('emptyText') emptyText: ElementRef;
  @ViewChild('loadingSpinner') loadingSpinner: ElementRef;
  galleries: IGallery[];
  general = {} as IGeneral;

  ngOnInit(): void {
    this.generalService.getGeneralInformation().subscribe(general => {
      this.general = general;
      this.general.description = this.generalService.formatString(general.description);
    });

    this.galleryService.getAllGalleriesMedium().subscribe(galleries => {
      this.galleries = galleries;
      this.hideSpinner();
      this.checkIfEmptyShowText();
    });
  }

  private hideSpinner(): void {
    this.loadingSpinner.nativeElement.style.display = 'none';
  }

  private checkIfEmptyShowText(): void {
    if (this.galleries.length === 0) {
      this.emptyText.nativeElement.style.display = 'block';
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
