import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryRoutingModule } from './country-routing.module';
import { FormComponent } from '@shared/component/form/form.component';
import { TableComponent } from '@shared/component/table/table.component';
import { CountryService } from '@shared/_http/country.service';
import { CountryComponent } from './country.component';
import { CuCountryComponent } from './cu-country/cu-country.component';


@NgModule({
  declarations: [CountryComponent,CuCountryComponent],
   imports: [
    CommonModule,
    FormComponent,
    CountryRoutingModule,
    TableComponent
  ],
  providers: [CountryService]
})
export class CountryModule { }
