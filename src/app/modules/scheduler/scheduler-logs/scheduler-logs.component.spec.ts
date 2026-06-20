import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerLogsComponent } from './scheduler-logs.component';

describe('SchedulerLogsComponent', () => {
  let component: SchedulerLogsComponent;
  let fixture: ComponentFixture<SchedulerLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulerLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
