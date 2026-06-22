import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTrainingListComponent } from './driver-training-list.component';

describe('DriverTrainingListComponent', () => {
  let component: DriverTrainingListComponent;
  let fixture: ComponentFixture<DriverTrainingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverTrainingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverTrainingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
