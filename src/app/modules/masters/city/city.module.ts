import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { CuCityComponent } from './cu-city/cu-city.component';
import { CityComponent } from './city.component';
import { TableComponent } from '@shared/component/table/table.component';
import { FormComponent } from '@shared/component/form/form.component';
import { CityService } from '@shared/_http/city.service';
import { StateService } from '@shared/_http/state.service';
import { CountryService } from '@shared/_http/country.service';


@NgModule({
  declarations: [CityComponent, CuCityComponent],
  imports: [
    CommonModule,
    CityRoutingModule,
    FormComponent,
    TableComponent
  ],
  providers: [CityService,StateService,CountryService]
})
export class CityModule { }
