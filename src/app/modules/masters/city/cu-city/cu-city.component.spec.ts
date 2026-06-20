import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuCityComponent } from './cu-city.component';

describe('CuCityComponent', () => {
  let component: CuCityComponent;
  let fixture: ComponentFixture<CuCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuCityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
