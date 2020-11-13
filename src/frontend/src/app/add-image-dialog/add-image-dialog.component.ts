import {Component, Input, OnInit} from '@angular/core';
import {IGallery} from '../entity/IGallery';
import {ImageService} from '../service/image/image.service';

declare var $: any;

@Component({
  selector: 'app-add-image-dialog',
  templateUrl: './add-image-dialog.component.html',
  styleUrls: ['./add-image-dialog.component.css']
})
export class AddImageDialogComponent implements OnInit {

  @Input() currentGallery: IGallery;
  imageSource: string;

  constructor(private imageService: ImageService) {
  }

  ngOnInit(): void {
    document.getElementById('fileUpload').addEventListener('change', event => {
      const eventTarget = event.target as HTMLInputElement;
      const file = eventTarget.files[0];
      if (file != null) {
        this.convertImage(file);
      }
    });

    $('#addImageModal').on('hide.bs.modal', ev => {
      const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
      fileUpload.value = null;
      this.imageSource = null;
    });
  }

  private convertImage(file): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (ev) => {
      const base64 = ev.target.result.toString();
      const type = base64.substring(5, 15);
      if (type === 'image/png;' || type === 'image/jpeg') {
        this.imageSource = base64;
      }
    };
  }

  uploadImage(): void{

  }

}
