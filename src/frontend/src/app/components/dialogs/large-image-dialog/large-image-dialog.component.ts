import {Component, Input, OnInit} from '@angular/core';
import {IImage} from '../../../entity/IImage';
import {Location, PlatformLocation} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-large-image-dialog',
  templateUrl: './large-image-dialog.component.html',
  styleUrls: ['./large-image-dialog.component.css']
})
export class LargeImageDialogComponent implements OnInit {

  @Input() image: IImage;

  constructor(private platformLocation: PlatformLocation, private location: Location) {
  }

  ngOnInit(): void {
    $('#largeImageModal').on('hide.bs.modal', () => {
      const replacement = '/' + this.image.image_id;
      this.location.go(this.location.path().replace(replacement, ''));
    });
  }

}
