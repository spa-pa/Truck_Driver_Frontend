import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuStateComponent } from './cu-state.component';

describe('CuStateComponent', () => {
  let component: CuStateComponent;
  let fixture: ComponentFixture<CuStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
