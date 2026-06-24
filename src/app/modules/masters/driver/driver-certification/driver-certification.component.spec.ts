import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCertificationComponent } from './driver-certification.component';

describe('DriverCertificationComponent', () => {
  let component: DriverCertificationComponent;
  let fixture: ComponentFixture<DriverCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverCertificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
