import {Component, OnInit} from '@angular/core';
import {IAbout} from '../../entity/IAbout';
import {GeneralService} from "../../service/general/general.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  about: IAbout = {description: '', name: '', picture: ''};

  constructor(private generalService: GeneralService) {
  }

  ngOnInit(): void {
    this.generalService.getAboutInformation().subscribe(about => {
      this.about = about;
    });
  }

  decodeNewLine(description: string):string {
    return description.replace('\n', '<br>');
  }
}
