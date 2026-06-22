import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverTrainingListRoutingModule } from './driver-training-list-routing.module';
import { FormComponent } from '@shared/component/form/form.component';
import { TableComponent } from '@shared/component/table/table.component';
import { DriverTrainingListComponent } from './driver-training-list.component';
import { DriverCertificationComponent } from '../driver-certification/driver-certification.component';


@NgModule({
  declarations: [DriverTrainingListComponent],
  imports: [
    CommonModule,
    FormComponent,
    TableComponent,
    DriverCertificationComponent,
    DriverTrainingListRoutingModule
  ]
})
export class DriverTrainingListModule { }
