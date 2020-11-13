import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAboutMeComponent } from './dashboard-about-me.component';

describe('DashboardAboutMeComponent', () => {
  let component: DashboardAboutMeComponent;
  let fixture: ComponentFixture<DashboardAboutMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAboutMeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAboutMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
