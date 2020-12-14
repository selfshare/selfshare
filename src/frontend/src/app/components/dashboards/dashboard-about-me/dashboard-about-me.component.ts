import {Component, OnInit} from '@angular/core';
import {IAbout} from "../../../entity/IAbout";
import {GeneralService} from "../../../service/general/general.service";

@Component({
  selector: 'app-dashboard-about-me',
  templateUrl: './dashboard-about-me.component.html',
  styleUrls: ['./dashboard-about-me.component.scss']
})
export class DashboardAboutMeComponent implements OnInit {

  about: IAbout = {email: '', description: '', name: '', picture: ''};

  constructor(private generalService: GeneralService) {
  }

  ngOnInit(): void {
    this.generalService.getAboutInformation().subscribe(about => {
      this.about = about;
    });

    document.getElementById('uploadFile').addEventListener('change', event => {
      const eventTarget = event.target as HTMLInputElement;
      const file = eventTarget.files[0];
      if (file != null) {
        this.convertImage(file);
      }
    });
  }

  private convertImage(file): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (ev) => {
      const base64 = ev.target.result.toString();
      const type = base64.substring(5, 15);
      if (type === 'image/png;' || type === 'image/jpeg') {
        this.compressImage(base64, 500, (compressed) => {
          this.about.picture = compressed;
        });
      }
    };
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
        const ratio = size / image.width;
        const height = image.height * ratio;
        const startY = (height - size) / 2;
        context.drawImage(image, 0, -startY, size, height);
        return callback(canvas.toDataURL());
      }
    };
  }

  uploadImage(): void {
    document.getElementById('uploadFile').click();
  }

  dismiss(): void {
    console.log('restore');
    this.generalService.getAboutInformation().subscribe(about => {
      this.about = about;
    });
  }

  save(): void {
    this.generalService.updateAboutInformation(this.about).subscribe(code => {
      console.log(code);
    });
  }
}
