import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuUserMasterComponent } from './cu-user-master.component';

describe('CuUserMasterComponent', () => {
  let component: CuUserMasterComponent;
  let fixture: ComponentFixture<CuUserMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuUserMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuUserMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
