import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRScanDriverDetailsComponent } from './qr-scan-driver-details.component';

describe('QRScanDriverDetailsComponent', () => {
  let component: QRScanDriverDetailsComponent;
  let fixture: ComponentFixture<QRScanDriverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QRScanDriverDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QRScanDriverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
