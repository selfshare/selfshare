import {Component, OnInit} from '@angular/core';
import {IAbout} from '../../entity/IAbout';
import {GeneralService} from "../../service/general/general.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  about: IAbout = {email: '', description: '', name: '', picture: ''};

  constructor(private generalService: GeneralService) {
  }

  ngOnInit(): void {
    this.generalService.getAboutInformation().subscribe(about => {
      this.about = about;
    });
  }

  getDescription(): string{
    return '<a>hello</a>'; // implement a links to click
}
}
