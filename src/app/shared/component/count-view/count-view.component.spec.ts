import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountViewComponent } from './count-view.component';

describe('CountViewComponent', () => {
  let component: CountViewComponent;
  let fixture: ComponentFixture<CountViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
