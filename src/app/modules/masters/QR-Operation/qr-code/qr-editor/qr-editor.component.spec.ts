import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrEditorComponent } from './qr-editor.component';

describe('QrEditorComponent', () => {
  let component: QrEditorComponent;
  let fixture: ComponentFixture<QrEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
