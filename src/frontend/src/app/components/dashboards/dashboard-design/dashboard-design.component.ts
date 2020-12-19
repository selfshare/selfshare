import {Component, OnInit} from '@angular/core';
import {IGeneral} from '../../../entity/IGeneral';
import {GeneralService} from '../../../service/general/general.service';

@Component({
  selector: 'app-dashboard-design',
  templateUrl: './dashboard-design.component.html',
  styleUrls: ['./dashboard-design.component.scss']
})
export class DashboardDesignComponent implements OnInit {

  general = {} as IGeneral;
  textChanged = false;
  availableThemes = ['Cerulean', 'Cosmo', 'Cyborg', 'Darkly', 'Flatly', 'Journal',
    'Litera', 'Lux', 'Materia', 'Minty', 'Pulse', 'Sandstone', 'Simplex', 'Sketchy', 'Slate', 'Solar', 'Spacelab', 'Superhero', 'United', 'Yeti'];

  constructor(private generalService: GeneralService) {
  }

  ngOnInit(): void {
    document.querySelectorAll('.text-changer').forEach(element => {
      element.addEventListener('input', event => {
        this.textChanged = true;
      });
    });

    this.generalService.getGeneralInformation().subscribe(general => {
      this.general = general;
    });
  }

  dismiss(): void {
    console.log('restore');
    this.generalService.getGeneralInformation().subscribe(general => {
      this.general = general;
      this.textChanged = false;
    });
  }

  save(): void {
    const general = {} as IGeneral;
    Object.assign(general, this.general);
    if (general.description) {
      general.description = general.description.replace(/"/g, '\\"');
    }

    this.generalService.updateGeneralInformation(general).subscribe(code => {
      console.log(code);
      this.textChanged = false;
      document.location.reload();
    });
  }
}
