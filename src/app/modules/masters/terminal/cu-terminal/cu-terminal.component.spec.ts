import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuTerminalComponent } from './cu-terminal.component';

describe('CuTerminalComponent', () => {
  let component: CuTerminalComponent;
  let fixture: ComponentFixture<CuTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuTerminalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
