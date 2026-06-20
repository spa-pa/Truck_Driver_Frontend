import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPagePermissionComponent } from './modify-page-permission.component';

describe('ModifyPagePermissionComponent', () => {
  let component: ModifyPagePermissionComponent;
  let fixture: ComponentFixture<ModifyPagePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyPagePermissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyPagePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
