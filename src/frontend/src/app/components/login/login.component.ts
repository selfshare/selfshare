import { Component, OnInit } from '@angular/core';
import {ISecurity} from "../../entity/ISecurity";
import {SecurityService} from "../../service/security/security.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  security = {} as ISecurity;

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.securityService.login(this.security).subscribe(response => {

    });
  }
}
