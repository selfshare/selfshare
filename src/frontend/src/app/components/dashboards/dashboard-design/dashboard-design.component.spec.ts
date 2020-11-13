import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDesignComponent } from './dashboard-design.component';

describe('DashboardDesignComponent', () => {
  let component: DashboardDesignComponent;
  let fixture: ComponentFixture<DashboardDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
