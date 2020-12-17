import { Component, OnInit } from '@angular/core';
import {SecurityService} from '../../../service/security/security.service';
import {ISecurity} from '../../../entity/ISecurity';

@Component({
  selector: 'app-dashboard-security',
  templateUrl: './dashboard-security.component.html',
  styleUrls: ['./dashboard-security.component.scss']
})
export class DashboardSecurityComponent implements OnInit {
  textChanged = false;

  security = {} as ISecurity;

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    document.querySelectorAll('.text-changer').forEach(element => {
      element.addEventListener('input', () => {
        this.textChanged = true;
      });
    });

    this.securityService.authenticate().subscribe(response => {
      this.security.username = response.body;
    });
  }

  save(): void {
    this.securityService.updateSecurityInformation(this.security).subscribe(code => {
      console.log(code);
    });
  }

  dismiss(): void {

  }
}
