import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryConfigComponent } from './expiry-config.component';

describe('ExpiryConfigComponent', () => {
  let component: ExpiryConfigComponent;
  let fixture: ComponentFixture<ExpiryConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiryConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiryConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
