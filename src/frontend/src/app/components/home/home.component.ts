import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GalleryService} from '../../service/gallery/gallery.service';
import {IGallery} from '../../entity/IGallery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  constructor(private galleryService: GalleryService) { }

  galleries: IGallery[];

  ngOnInit(): void {
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


  private getGalleryTitleAndResize(galleryIndex: number): string {
    if (galleryIndex === 0){
      this.resizeImages();
    }
    return this.galleries[galleryIndex].title;
  }

  private hideSpinner(): void{
    const spinner: any = document.getElementById('loading-spinner');
    spinner.style.display = 'none';
  }

  private checkIfEmptyShowText(): void{
    if (this.galleries.length === 0){
      const text: any = document.getElementById('emptyText');
      text.style.display = 'block';
    }
  }
}
