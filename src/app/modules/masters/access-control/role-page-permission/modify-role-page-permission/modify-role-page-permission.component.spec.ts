import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyRolePagePermissionComponent } from './modify-role-page-permission.component';

describe('ModifyRolePagePermissionComponent', () => {
  let component: ModifyRolePagePermissionComponent;
  let fixture: ComponentFixture<ModifyRolePagePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyRolePagePermissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyRolePagePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
