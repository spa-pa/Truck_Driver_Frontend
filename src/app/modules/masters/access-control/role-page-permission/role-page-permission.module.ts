import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolePagePermissionRoutingModule } from './role-page-permission-routing.module';
import { ModifyRolePagePermissionComponent } from './modify-role-page-permission/modify-role-page-permission.component';
// import { RoleAndPermissionsControllerService } from '@shared/_http/role-permission.service';
import { FormComponent } from '@shared/component/form/form.component';
import { TableComponent } from '@shared/component/table/table.component';
// import { PagesService } from '@shared/_http/pages.service';
// import { RoleService } from '@shared/_http/role.service';
// import { PermissionService } from '@shared/_http/permission.service';
import { RolePagePermissionComponent } from './role-page-permission.component';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { RoleService } from '@shared/_http/role.service';
// import { PagePermissionService } from '@shared/_http/page-permission.service';


@NgModule({
  declarations: [RolePagePermissionComponent,ModifyRolePagePermissionComponent],
  imports: [
    CommonModule,
    FormComponent,
    TableComponent,
    RolePagePermissionRoutingModule
  ],
  providers:[
    PermissionControllerService,
    RoleService,
    // RoleAndPermissionsControllerService,PagesService,RoleService,PermissionService,PagePermissionService
  ]
})
export class RolePagePermissionModule { }
