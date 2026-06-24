import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminalRoutingModule } from './terminal-routing.module';
import { CountryService } from '@shared/_http/country.service';
import { TerminalService } from '@shared/_http/terminal.service';
import { StateService } from '@shared/_http/state.service';
import { CityService } from '@shared/_http/city.service';
import { CuTerminalComponent } from './cu-terminal/cu-terminal.component';
import { FormComponent } from '@shared/component/form/form.component';
import { TableComponent } from '@shared/component/table/table.component';
import { TerminalComponent } from './terminal.component';


@NgModule({
  declarations: [CuTerminalComponent, TerminalComponent],
  imports: [
    CommonModule,
    TerminalRoutingModule,
    FormComponent,
    TableComponent
  ],
  providers: [CountryService, TerminalService, StateService, CityService]
})
export class TerminalModule { }
