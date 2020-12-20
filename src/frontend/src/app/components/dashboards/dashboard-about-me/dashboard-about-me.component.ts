import {Component, OnInit} from '@angular/core';
import {IAbout} from '../../../entity/IAbout';
import {GeneralService} from '../../../service/general/general.service';
import {ImageService} from '../../../service/image/image.service';

@Component({
  selector: 'app-dashboard-about-me',
  templateUrl: './dashboard-about-me.component.html',
  styleUrls: ['./dashboard-about-me.component.scss']
})
export class DashboardAboutMeComponent implements OnInit {

  about: IAbout = {} as IAbout;
  textChanged = false;

  constructor(private generalService: GeneralService, private imageService: ImageService) {
  }

  ngOnInit(): void {
    document.querySelectorAll('.text-changer').forEach(element => {
      element.addEventListener('input', () => {
        this.textChanged = true;
      });
    });

    this.generalService.getAboutInformation().subscribe(about => {
      this.about = about;
      if (about.picture == null || about.picture.length === 0) {
        this.about.picture = 'assets/login_icon.svg';
      }
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
        this.imageService.compressImage(base64, 500, (compressed) => {
          this.about.picture = compressed;
        });
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
      this.textChanged = false;
    });
  }

  save(): void {
    const about: IAbout = {} as IAbout;
    Object.assign(about, this.about);
    if (about.description) {
      about.description = about.description.replace(/"/g, '\\"');
    }

    this.generalService.updateAboutInformation(about).subscribe(code => {
      console.log(code);
      this.textChanged = false;
    });
  }
}
