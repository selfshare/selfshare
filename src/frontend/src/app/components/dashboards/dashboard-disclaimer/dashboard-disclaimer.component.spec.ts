import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDisclaimerComponent } from './dashboard-disclaimer.component';

describe('DashboardDisclaimerComponent', () => {
  let component: DashboardDisclaimerComponent;
  let fixture: ComponentFixture<DashboardDisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDisclaimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
