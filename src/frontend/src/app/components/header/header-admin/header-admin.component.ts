import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent implements OnInit {

  constructor(private router: Router) {
    router.events.subscribe((event: NavigationEnd) => {
      if (event instanceof NavigationEnd){
        document.querySelectorAll('.nav-link').forEach(element => {

          const parent = element.parentElement;
          const navText = '/' + element.innerHTML.toLowerCase();
          let routerUrl = event.url;
          if (routerUrl.length === 1){
            routerUrl = '/home';
          }

          if (navText === routerUrl){
            console.log(navText);
            parent.classList.add('active');
          }else{
            parent.classList.remove('active');
          }
        });
      }
    });
  }

  ngOnInit(): void {
  }

}
