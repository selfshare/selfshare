import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnInit {

  @ViewChild('tabs') tabs: ElementRef;

  selectedIndex = 0;

  urls = ['content', 'about', 'security', 'design', 'disclaimer'];

  constructor(private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit(): void {
    const view = this.route.snapshot.paramMap.get('view');
    if (view != null) {
      const found = this.urls.find(str => str === view);
      this.selectedIndex = this.urls.indexOf(found);
    }
  }

  ngAfterViewInit(): void {
    this.updateActive();
  }

  changeView(index: number): void {
    this.selectedIndex = index;
    this.updateActive();
    this.location.go('dashboard/' + this.urls[index]);
  }

  private updateActive(): void {
    const children = this.tabs.nativeElement.children;
    for (const i in children) {
      if (children.hasOwnProperty(i)) {
        if (children[i] instanceof HTMLElement) {
          if (+i === this.selectedIndex) {
            children[i].children[0].classList.add('active');
          } else {
            children[i].children[0].classList.remove('active');
          }
        }
      }
    }
  }

}
