import {Component, Input, OnInit} from '@angular/core';
import {IGallery} from '../entity/IGallery';
import {ImageService} from '../service/image/image.service';

declare var $: any;

@Component({
  selector: 'app-add-image-dialog',
  templateUrl: './add-image-dialog.component.html',
  styleUrls: ['./add-image-dialog.component.scss']
})
export class AddImageDialogComponent implements OnInit {

  @Input() currentGallery: IGallery;
  imageSource: string;
  mediumSource: string;
  smallSource: string;
  conversionsDone = false;

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
      if (type === 'image/png;' || type === 'image/jpeg' || type === 'image/gif;') {
        this.imageSource = base64;

        this.compressImage(this.imageSource, 350, (compressed1) => {
          this.mediumSource = compressed1;
          this.compressImage(this.imageSource, 25, (compressed2) => {
            this.smallSource = compressed2;
            this.conversionsDone = true;
          });
        });
      }
    };
  }

  uploadImage(): void {
    const image: any = {
      base64_large: this.imageSource,
      base64_medium: this.mediumSource,
      base64_small: this.smallSource,
      description: '',
      gallery_id: this.currentGallery.gallery_id,
      tag: '',
      title: '',
      image_id: 0,
      upload_timestamp: null
    };
    this.imageService.uploadImage(image).subscribe(status => {
      console.log(status);
      location.reload();
    });
  }

  private compressImage(base64: string, size: number, callback: any): any {
    const canvas = document.createElement('canvas');
    canvas.height = size;
    canvas.width = size;
    canvas.style.display = 'none';
    const context = canvas.getContext('2d');
    const image = new Image();

    image.src = base64;
    image.onload = () => {
      if (image.width > image.height) {
        const ratio = size / image.height;
        const width = image.width * ratio;
        const startX = (width - size) / 2;
        context.drawImage(image, -startX, 0, width, size);
        return callback(canvas.toDataURL());
      } else {
        return '';
      }
    };
  }
}
