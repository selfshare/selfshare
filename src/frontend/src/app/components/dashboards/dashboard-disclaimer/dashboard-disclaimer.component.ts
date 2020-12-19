import { Component, OnInit } from '@angular/core';
import {GeneralService} from "../../../service/general/general.service";
import {IResponse} from "../../../entity/IResponse";
import {IAbout} from "../../../entity/IAbout";

@Component({
  selector: 'app-dashboard-disclaimer',
  templateUrl: './dashboard-disclaimer.component.html',
  styleUrls: ['./dashboard-disclaimer.component.css']
})
export class DashboardDisclaimerComponent implements OnInit {

  disclaimer: string = '';
  textChanged: boolean = false;

  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    document.querySelectorAll('.text-changer').forEach(element => {
      element.addEventListener('input', () => {
        this.textChanged = true;
      });
    });

    this.generalService.getDisclaimerInformation().subscribe(disclaimer => {
      this.disclaimer = disclaimer.body;
    });
  }

  dismiss(): void {
    console.log('restore');
    this.generalService.getDisclaimerInformation().subscribe(disclaimer => {
      this.disclaimer = disclaimer.body;
      this.textChanged = false;
    });
  }

  save(): void {
    let disclaimer: IResponse = {body: this.disclaimer, code: 200};
    if (disclaimer.body) {
      disclaimer.body = disclaimer.body.replace(/"/g, '\\"');
    }
    this.generalService.updateDisclaimerInformation(disclaimer).subscribe(code => {
      console.log(code);
      this.textChanged = false;
    });
  }
}
