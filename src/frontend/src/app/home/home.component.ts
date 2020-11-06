import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, AfterViewInit {
  constructor() { }

  galleries = ['Gallery 1', 'Gallery 2', 'Gallery 3'];
  images = ['/assets/IMG_20200919_181732.jpg', '/assets/IMG_20200913_151547.jpg', '/assets/DSC_0052.JPG'];

  ngOnInit(): void {
    for (let i = 0; i < 20; i++){
      this.galleries[i] = 'Gallery ' + (i+1) + ' with a very long name! This is an example. 64 Letters!';
    }
  }

  resizeImages(): void {
    const cardWidth: number = document.getElementsByClassName('card')[0].clientWidth;
    const galleryImages: any = document.querySelectorAll('.modalImage');
    galleryImages.forEach((img) => {
      img.style.minHeight = cardWidth + 'px';
      img.style.maxHeight = cardWidth + 'px';
    });
  }

  ngAfterViewInit(): void {
    this.resizeImages();

    window.addEventListener('resize', ev => {
      this.resizeImages();
    });
  }




}
