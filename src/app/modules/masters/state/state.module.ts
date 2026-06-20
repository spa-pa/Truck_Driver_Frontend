import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateRoutingModule } from './state-routing.module';
import { StateComponent } from './state.component';
import { TableComponent } from '@shared/component/table/table.component';
import { FormComponent } from '@shared/component/form/form.component';
import { StateService } from '@shared/_http/state.service';
import { CountryService } from '@shared/_http/country.service';
import { CuStateComponent } from './cu-state/cu-state.component';


@NgModule({
  declarations: [StateComponent, CuStateComponent],
  imports: [
    CommonModule,
    TableComponent,
    FormComponent,
    StateRoutingModule
  ],
  providers: [StateService,CountryService]
})
export class StateModule { }
