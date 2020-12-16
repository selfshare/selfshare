import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedIndex = 0;

  urls = ['content', 'about', 'security', 'design'];

  constructor(private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {

    const view = this.route.snapshot.paramMap.get('view');
    if (view != null){
      const found = this.urls.find(str => str === view);
      this.selectedIndex = this.urls.indexOf(found);
    }

    this.updateActive();
  }

  changeView(index: number): void{
   this.selectedIndex = index;
   this.updateActive();
   this.location.go('dashboard/' + this.urls[index]);
  }

  private updateActive(): void {
    const tabs = document.getElementById('tabs').children;
    for (const i in tabs){
      if (tabs[i] instanceof HTMLElement){
        if (+i === this.selectedIndex){
          tabs[i].children[0].classList.add('active');
        }else{
          tabs[i].children[0].classList.remove('active');
        }
      }
    }
  }

}
