import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverEntryListRoutingModule } from './driver-entry-list-routing.module';
import { DriverEntryListComponent } from './driver-entry-list.component';
import { TableComponent } from '@shared/component/table/table.component';
import { DriverTrainingService } from '@shared/_http/driver-training.service';
import { DriverCertificationComponent } from '@modules/masters/driver/driver-certification/driver-certification.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [DriverEntryListComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    DriverCertificationComponent,
    DriverEntryListRoutingModule
  ],
  providers: [DriverTrainingService]
})
export class DriverEntryListModule { }
