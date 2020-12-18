import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SecurityService} from '../../service/security/security.service';
import {GeneralService} from "../../service/general/general.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title = '';
  username = '';
  loginClass = 'hidden';
  logoutClass = 'hidden';

  constructor(private router: Router, private securityService: SecurityService, private generalService: GeneralService) {
    const header = document.head.children;
    this.generalService.getGeneralInformation().subscribe(info => {
      header[1].innerHTML = info.title; // title
      this.title = info.title;
      if (info.theme) {
        (header[6] as HTMLAnchorElement).href = 'https://bootswatch.com/4/' + info.theme.toLowerCase() + '/bootstrap.min.css'; // style
      }

    });


    router.events.subscribe((event: NavigationEnd) => {
      if (event instanceof NavigationEnd) {
        document.querySelectorAll('.nav-link').forEach(element => {

          const parent = element.parentElement;
          const navText = '/' + element.innerHTML.toLowerCase();
          let routerUrl = event.url;
          if (routerUrl.length === 1) {
            routerUrl = '/home';
          }

          if (navText === routerUrl) {
            parent.classList.add('active');
          } else {
            parent.classList.remove('active');
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.securityService.authenticate().subscribe(response => {
      if (response.code === 200) {
        this.username = response.body;
        this.logoutClass = '';
      } else {
        this.loginClass = '';
      }
    });
  }

  logout(): void {
    localStorage.removeItem('loginHash');
    window.location.reload();
  }
}
