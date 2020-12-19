import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ISecurity} from '../../entity/ISecurity';
import {SecurityService} from '../../service/security/security.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements AfterViewInit {

  @ViewChild('inputUsername') inputUsername: ElementRef;
  @ViewChild('inputPassword') inputPassword: ElementRef;
  @ViewChild('repeatPassword') repeatPassword: ElementRef;

  security = {} as ISecurity;
  showPassword = false;
  hideUsernameError = 'hidden';
  hidePasswordError = 'hidden';
  hideRepeatError = 'hidden';

  constructor(private securityService: SecurityService) {
  }

  ngAfterViewInit(): void {
    this.inputUsername.nativeElement.addEventListener('input', () => this.hideUsernameError = 'hidden');

    this.inputPassword.nativeElement.addEventListener('input', () => this.hidePasswordError = 'hidden');

    this.repeatPassword.nativeElement.addEventListener('input', () => this.hideRepeatError = 'hidden');
  }

  submit(): void {
    const res = this.securityService.checkInputValid(this.security, this.repeatPassword);
    this.hideUsernameError = res.hideUsernameError;
    this.hidePasswordError = res.hidePasswordError;
    this.hideRepeatError = res.hideRepeatError;
    if (res.valid) {
      this.securityService.updateSecurityInformation(this.security).subscribe(response => {
        if (response.code === 200) {
          this.securityService.login(this.security).subscribe(response2 => {
            if (response2.code === 200) {
              console.log(response2);
              localStorage.setItem('loginHash', response2.body);
              window.location.reload();
            }
          });
        }
      });
    }
  }

  generatePassword(): void {
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
