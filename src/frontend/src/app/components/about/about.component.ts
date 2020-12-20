import {Component, OnInit} from '@angular/core';
import {IAbout} from '../../entity/IAbout';
import {GeneralService} from '../../service/general/general.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  about: IAbout = {} as IAbout;

  constructor(private generalService: GeneralService) {
  }

  ngOnInit(): void {
    this.generalService.getAboutInformation().subscribe(about => {
      this.about = about;
      if (about.picture == null || about.picture.length === 0) {
        this.about.picture = 'assets/login_icon.svg';
      }
      this.about.description = this.generalService.formatString(about.description);
    });
  }
}
