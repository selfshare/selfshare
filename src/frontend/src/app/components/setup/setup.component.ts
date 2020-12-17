import { Component, OnInit } from '@angular/core';
import {IAbout} from "../../entity/IAbout";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  about = {} as IAbout;

  constructor() { }

  ngOnInit(): void {
    this.about.picture = 'assets/login-icon.svg';
  }

}
