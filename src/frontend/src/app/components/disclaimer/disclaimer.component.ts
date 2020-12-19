import { Component, OnInit } from '@angular/core';
import {IResponse} from "../../entity/IResponse";
import {GeneralService} from "../../service/general/general.service";

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {
  disclaimer: string = 'static test' as string;

  constructor(private generalService: GeneralService) {
    console.log("Test passed")
  }

  ngOnInit(): void {
    this.generalService.getDisclaimerInformation().subscribe(disclaimer => {
      // This is not being called
      console.log("Disclaimer", disclaimer);
      console.log("Body", disclaimer.body);
      this.disclaimer = disclaimer.body;
      this.formatDisclaimer();
    });
  }

  formatDisclaimer(): void {
    if (this.disclaimer) {
      let match;
      const htmlRegex = /<[^>]*>?/gm;

      let str = this.disclaimer.replace(htmlRegex, '');
      const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

      match = str.match(emailRegex);
      if (match != null) {
        do {
          this.disclaimer = this.disclaimer.replace(match[0], `<a href="mailto:${match[0]}">${match[0]}</a>`);
          str = str.substring(str.indexOf(match[0]) + match[0].length);
          match = str.match(emailRegex);
        } while (match != null);
      }

      str = this.disclaimer.replace(htmlRegex, '');
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

      match = str.match(urlRegex);
      if (match != null) {
        do {
          this.disclaimer = this.disclaimer.replace(match[0], `<a target="_blank" href="${match[0]}">${match[0]}</a>`);
          str = str.substring(str.indexOf(match[0]) + match[0].length);
          match = str.match(urlRegex);
        } while (match != null);
      }
    }
  }
}
