import {Component, Input, OnInit} from '@angular/core';
import {IImage} from '../../../entity/IImage';
import {PlatformLocation} from '@angular/common';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-large-image-dialog',
  templateUrl: './large-image-dialog.component.html',
  styleUrls: ['./large-image-dialog.component.css']
})
export class LargeImageDialogComponent implements OnInit {

  @Input() image: IImage;

  constructor(private platformLocation: PlatformLocation, private location: Location, private router: Router) {
  }

  ngOnInit(): void {

    $('#largeImageModal').on('hide.bs.modal', ev => {
      const replacement = '/' + this.image.image_id;
      this.location.go(this.location.path().replace(replacement, ''));
    });


    // this.location.onUrlChange(url => {
    //   console.log('url change');
    //   this.manualHide = true;
    //   $('#largeImageModal').modal('hide');
    // });
  }

}
