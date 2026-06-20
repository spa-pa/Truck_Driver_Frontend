import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/component/table/table.component';
import { FormComponent } from '@shared/component/form/form.component';
import { PermissionRoutingModule } from './permission-routing.module';
import { PermissionComponent } from './permission.component';
import { ModifyPermissionComponent } from './modify-permission/modify-permission.component';
import { PermissionControllerService } from '@shared/_http/permissions.service';


@NgModule({
  declarations: [PermissionComponent,ModifyPermissionComponent],
  imports: [
    CommonModule,
    FormComponent,
    TableComponent,
    PermissionRoutingModule
  ],
  providers: [PermissionControllerService]
})
export class PermissionModule { }
