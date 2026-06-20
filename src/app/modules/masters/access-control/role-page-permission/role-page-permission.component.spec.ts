import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePagePermissionComponent } from './role-page-permission.component';

describe('RolePagePermissionComponent', () => {
  let component: RolePagePermissionComponent;
  let fixture: ComponentFixture<RolePagePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePagePermissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolePagePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
