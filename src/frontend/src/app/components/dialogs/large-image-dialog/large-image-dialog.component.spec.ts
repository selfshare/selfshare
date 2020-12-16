import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeImageDialogComponent } from './large-image-dialog.component';

describe('LargeImageDialogComponent', () => {
  let component: LargeImageDialogComponent;
  let fixture: ComponentFixture<LargeImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LargeImageDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
