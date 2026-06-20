import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolePagePermissionComponent } from './role-page-permission.component';
import { ModifyRolePagePermissionComponent } from './modify-role-page-permission/modify-role-page-permission.component';

const routes: Routes = [
  {
    path: '', component: RolePagePermissionComponent,
    data: {
        title: "Role page permission List",
        breadcrumb: "Role page permission List",
    }
  },
  {
      path: 'create', component: ModifyRolePagePermissionComponent,
      data: {
          title: "Role page permission Create",
          breadcrumb: "Role page permission Create",
      }
  },
  {
      path: 'edit/:id', component: ModifyRolePagePermissionComponent,
      data: {
          title: "Edit Role page permission",
          breadcrumb: "Edit Role page permission",
      }
  },
  {
      path: 'view/:id', component: ModifyRolePagePermissionComponent,
      data: {
          title: "View Role page permission",
          breadcrumb: "View Role page permission",
      }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolePagePermissionRoutingModule { }
