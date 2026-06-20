import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagePermissionRoutingModule } from './page-permission-routing.module';
import { PagePermissionComponent } from './page-permission.component';
import { ModifyPagePermissionComponent } from './modify-page-permission/modify-page-permission.component';
import { TableComponent } from '@shared/component/table/table.component';
import { FormComponent } from '@shared/component/form/form.component';
import { PagePermissionService } from '@shared/_http/page-permission.service';
import { SwitchComponent } from '@shared/component/switch/switch.component';
import { PageService} from '@shared/_http/pages.service';
import { PermissionService } from '@shared/_http/permission.service';
import { PermissionControllerService } from '@shared/_http/permissions.service';

@NgModule({
  declarations: [PagePermissionComponent, ModifyPagePermissionComponent],
  imports: [
    CommonModule,
    PagePermissionRoutingModule,
    FormComponent,
    TableComponent
  ],
  providers: [PagePermissionService,PageService,PermissionService,PermissionControllerService]
})
export class PagePermissionModule { }
