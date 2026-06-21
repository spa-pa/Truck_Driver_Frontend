import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrViewerModalComponent } from './qr-viewer-modal.component';

describe('QrViewerModalComponent', () => {
  let component: QrViewerModalComponent;
  let fixture: ComponentFixture<QrViewerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrViewerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
