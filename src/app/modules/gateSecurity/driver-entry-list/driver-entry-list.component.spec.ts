import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverEntryListComponent } from './driver-entry-list.component';

describe('DriverEntryListComponent', () => {
  let component: DriverEntryListComponent;
  let fixture: ComponentFixture<DriverEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverEntryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
