import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosterRoutingModule } from './poster-routing.module';
import { FormComponent } from '@shared/component/form/form.component';
import { TableComponent } from '@shared/component/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormComponent,
    ReactiveFormsModule,
    PosterRoutingModule,
    TableComponent
  ]
})
export class PosterModule { }
