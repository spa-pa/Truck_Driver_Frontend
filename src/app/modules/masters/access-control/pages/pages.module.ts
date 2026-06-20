import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from '@shared/component/form/form.component';
import { TableComponent } from '@shared/component/table/table.component';
import { PagesRoutingModule } from './pages-routing.module';
import { UploadFileComponent } from '@shared/component/upload-file/upload-file.component';
import { CheckboxComponent } from '@shared/component/checkbox/checkbox.component';
import { PagesComponent } from './pages.component';
import { ModifyPagesComponent } from './modify-pages/modify-pages.component';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { PageService } from '@shared/_http/pages.service';
@NgModule({
  declarations: [PagesComponent,ModifyPagesComponent],
  imports: [
    CommonModule,
    FormComponent,
    TableComponent,
    UploadFileComponent,
    CheckboxComponent,
    PagesRoutingModule
  ],
  providers: [PageService]
})
export class PagesModule { }
