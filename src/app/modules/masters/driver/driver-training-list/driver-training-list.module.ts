import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverTrainingListRoutingModule } from './driver-training-list-routing.module';
import { FormComponent } from '@shared/component/form/form.component';
import { TableComponent } from '@shared/component/table/table.component';
import { DriverTrainingListComponent } from './driver-training-list.component';
import { DriverCertificationComponent } from '../driver-certification/driver-certification.component';
import { FormsModule } from '@angular/forms';
import { CuDriverTrainingListComponent } from './cu-driver-training-list/cu-driver-training-list.component';
import { DriverCertificationService } from '@shared/_http/driver-certification.service';


@NgModule({
  declarations: [DriverTrainingListComponent, CuDriverTrainingListComponent],
  imports: [
    CommonModule,
    FormsModule,
    FormComponent,
    TableComponent,
    DriverCertificationComponent,
    DriverTrainingListRoutingModule
  ],
  providers:[DriverCertificationService]
})
export class DriverTrainingListModule { }
