import {Component, Input, OnInit} from '@angular/core';
import {IImage} from '../entity/IImage';
import {IGallery} from '../entity/IGallery';

@Component({
  selector: 'app-large-image-dialog',
  templateUrl: './large-image-dialog.component.html',
  styleUrls: ['./large-image-dialog.component.css']
})
export class LargeImageDialogComponent implements OnInit {

  @Input() image: IImage;

  constructor() { }

  ngOnInit(): void {
  }

}
