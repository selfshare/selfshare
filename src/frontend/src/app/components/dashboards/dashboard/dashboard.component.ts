import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  selectedIndex = 0;

  constructor() { }

  ngOnInit(): void {
    this.updateActive();
  }

  changeView(index: number): void{
   this.selectedIndex = index;
   this.updateActive();
  }

  private updateActive(): void {
    const tabs = document.getElementById('tabs').children;
    for (const i in tabs){
      if (tabs[i] instanceof HTMLElement){
        if (+i === this.selectedIndex){
          console.log(i);
          tabs[i].children[0].classList.add('active');
        }else{
          tabs[i].children[0].classList.remove('active');
        }
      }
    }
  }

}
