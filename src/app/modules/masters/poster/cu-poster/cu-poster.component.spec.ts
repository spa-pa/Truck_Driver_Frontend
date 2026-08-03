import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuPosterComponent } from './cu-poster.component';

describe('CuPosterComponent', () => {
  let component: CuPosterComponent;
  let fixture: ComponentFixture<CuPosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuPosterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuPosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
