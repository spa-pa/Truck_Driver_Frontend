import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuvSchedulerComponent } from './cuv-scheduler.component';

describe('CuvSchedulerComponent', () => {
  let component: CuvSchedulerComponent;
  let fixture: ComponentFixture<CuvSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuvSchedulerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuvSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
