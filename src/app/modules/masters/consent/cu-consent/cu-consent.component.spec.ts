import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuConsentComponent } from './cu-consent.component';

describe('CuConsentComponent', () => {
  let component: CuConsentComponent;
  let fixture: ComponentFixture<CuConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
