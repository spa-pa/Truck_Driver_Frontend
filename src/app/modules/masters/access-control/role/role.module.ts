import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { FormComponent } from '@shared/component/form/form.component';
import { TableComponent } from '@shared/component/table/table.component';
// import { RoleService } from '@shared/_http/role.service';
import { RoleComponent } from './role.component';
import { ModifyRoleComponent } from './modify-role/modify-role.component';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { MenuService } from '@shared/_http/menu.service';
import { RoleService } from '@shared/_http/role.service';
// import { MenuService } from '@shared/_http/menu.service';


@NgModule({
  declarations: [RoleComponent,ModifyRoleComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    FormComponent,
    TableComponent
  ],
  providers: [
    PermissionControllerService,
    RoleService,
    MenuService
  ]
})
export class RoleModule { }
