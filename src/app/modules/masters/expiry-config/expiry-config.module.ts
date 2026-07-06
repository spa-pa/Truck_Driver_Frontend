import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpiryConfigRoutingModule } from './expiry-config-routing.module';
import { TableComponent } from '@shared/component/table/table.component';
import { ExpiryConfigComponent } from './expiry-config.component';
import { CuExpiryConfigComponent } from './cu-expiry-config/cu-expiry-config.component';
import { ExpiryConfigService } from '@shared/_http/expiry-config.service';
import { FormComponent } from '@shared/component/form/form.component';


@NgModule({
  declarations: [ExpiryConfigComponent, CuExpiryConfigComponent],
  imports: [
    CommonModule,
    TableComponent,
    FormComponent,
    ExpiryConfigRoutingModule
  ],
  providers: [ExpiryConfigService]
})
export class ExpiryConfigModule { }
