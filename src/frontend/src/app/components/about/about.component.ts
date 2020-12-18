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
      if (about.picture == null) {
        this.about.picture = 'assets/login_icon.svg';
      }
      this.formatDescription();
    });
  }

  formatDescription(): void {
    if (this.about.description) {
      let match;
      const htmlRegex = /<[^>]*>?/gm;

      let str = this.about.description.replace(htmlRegex, '');
      const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

      match = str.match(emailRegex);
      if (match != null) {
        do {
          this.about.description = this.about.description.replace(match[0], `<a href="mailto:${match[0]}">${match[0]}</a>`);
          str = str.substring(str.indexOf(match[0]) + match[0].length);
          match = str.match(emailRegex);
        } while (match != null);
      }

      str = this.about.description.replace(htmlRegex, '');
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

      match = str.match(urlRegex);
      if (match != null) {
        do {
          this.about.description = this.about.description.replace(match[0], `<a target="_blank" href="${match[0]}">${match[0]}</a>`);
          str = str.substring(str.indexOf(match[0]) + match[0].length);
          match = str.match(urlRegex);
        } while (match != null);
      }


    }
  }
}
