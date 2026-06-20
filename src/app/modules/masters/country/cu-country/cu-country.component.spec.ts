import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuCountryComponent } from './cu-country.component';

describe('CuCountryComponent', () => {
  let component: CuCountryComponent;
  let fixture: ComponentFixture<CuCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuCountryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
