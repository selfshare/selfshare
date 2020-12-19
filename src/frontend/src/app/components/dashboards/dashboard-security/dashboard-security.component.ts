import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SecurityService} from '../../../service/security/security.service';
import {ISecurity} from '../../../entity/ISecurity';

@Component({
  selector: 'app-dashboard-security',
  templateUrl: './dashboard-security.component.html',
  styleUrls: ['./dashboard-security.component.scss']
})
export class DashboardSecurityComponent implements OnInit {
  @ViewChild('inputUsername') inputUsername: ElementRef;
  @ViewChild('inputPassword') inputPassword: ElementRef;
  @ViewChild('repeatPassword') repeatPassword: ElementRef;

  security = {} as ISecurity;
  showPassword = false;
  hideUsernameError = 'hidden';
  hidePasswordError = 'hidden';
  hideRepeatError = 'hidden';
  textChanged = false;

  constructor(private securityService: SecurityService) {
  }

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
    const res = this.securityService.checkInputValid(this.security, this.repeatPassword);
    this.hideUsernameError = res.hideUsernameError;
    this.hidePasswordError = res.hidePasswordError;
    this.hideRepeatError = res.hideRepeatError;
    if (res.valid) {
      this.securityService.updateSecurityInformation(this.security).subscribe(response => {
        console.log(response);
        window.location.reload();
      });
    }
  }

  dismiss(): void {
    this.securityService.authenticate().subscribe(response => {
      this.security.username = response.body;
      this.security.password = '';
      this.repeatPassword.nativeElement.value = '';
      this.hideUsernameError = 'hidden';
      this.hidePasswordError = 'hidden';
      this.hideRepeatError = 'hidden';
    });
  }

  generatePassword(): void {
    this.textChanged = true;
    this.security.password = this.getRandomPassword(8);
    this.repeatPassword.nativeElement.value = this.security.password;
    this.showPassword = true;
  }

  getRandomPassword(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW!$%#+-';
    let output = '';
    for (let i = 0; i < length; i++) {
      const random = Math.floor(Math.random() * chars.length);
      output += chars.charAt(random);
    }
    return output;
  }
}
