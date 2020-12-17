import {Component, OnInit} from '@angular/core';
import {ISecurity} from '../../entity/ISecurity';
import {SecurityService} from '../../service/security/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  security = {} as ISecurity;
  hideError = 'hidden';
  moveImage = '';

  constructor(private securityService: SecurityService) {
  }

  ngOnInit(): void {
    document.querySelectorAll('.text-changer').forEach(element => {
      element.addEventListener('input', () => {
        this.hideError = 'hidden';
        this.moveImage = '';
      });
    });
  }

  login(): void {
    this.hideError = 'hidden';
    this.moveImage = '';
    this.securityService.login(this.security).subscribe(response => {
      if (response.code === 200) {
        localStorage.setItem('loginHash', response.body);
        window.location.reload();
      } else {
        this.hideError = '';
        this.moveImage = 'move-icon';
        this.security = {} as ISecurity;
      }
    });
  }
}
