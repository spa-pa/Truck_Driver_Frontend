import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomList2Component } from './custom-list-2.component';

describe('CustomList2Component', () => {
  let component: CustomList2Component;
  let fixture: ComponentFixture<CustomList2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomList2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
