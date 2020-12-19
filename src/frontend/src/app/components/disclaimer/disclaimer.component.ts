import {Component, OnInit} from '@angular/core';
import {GeneralService} from '../../service/general/general.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {
  disclaimer = '';

  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
    this.generalService.getDisclaimerInformation().subscribe(disclaimer => {
      this.disclaimer = this.generalService.formatString(disclaimer.body);
    });
  }
}
