import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuExpiryConfigComponent } from './cu-expiry-config.component';

describe('CuExpiryConfigComponent', () => {
  let component: CuExpiryConfigComponent;
  let fixture: ComponentFixture<CuExpiryConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuExpiryConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuExpiryConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
