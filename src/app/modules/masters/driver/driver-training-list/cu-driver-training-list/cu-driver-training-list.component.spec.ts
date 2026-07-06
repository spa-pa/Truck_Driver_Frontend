import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuDriverTrainingListComponent } from './cu-driver-training-list.component';

describe('CuDriverTrainingListComponent', () => {
  let component: CuDriverTrainingListComponent;
  let fixture: ComponentFixture<CuDriverTrainingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuDriverTrainingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuDriverTrainingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
