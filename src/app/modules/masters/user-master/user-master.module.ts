import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserMasterRoutingModule } from './user-master-routing.module';
import { FormsModule } from '@angular/forms';
import { FormComponent } from '@shared/component/form/form.component';
import { TableComponent } from '@shared/component/table/table.component';
import { UserMasterComponent } from './user-master.component';
import { CuUserMasterComponent } from './cu-user-master/cu-user-master.component';
import { UserMasterService } from '@shared/_http/user-master.service';
import { RoleService } from '@shared/_http/role.service';


@NgModule({
  declarations: [UserMasterComponent, CuUserMasterComponent],
  imports: [
    CommonModule,
    FormComponent,
    TableComponent,
    UserMasterRoutingModule
  ],
  providers: [UserMasterService, RoleService]
})
export class UserMasterModule { }
