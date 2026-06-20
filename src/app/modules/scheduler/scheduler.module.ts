import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerRoutingModule } from './scheduler-routing.module';
import { TableComponent } from '@shared/component/table/table.component';
import { FormComponent } from '@shared/component/form/form.component';
import { SchedulerLogsComponent } from './scheduler-logs/scheduler-logs.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { CuvSchedulerComponent } from './cuv-scheduler/cuv-scheduler.component';
import { SchedulerService } from '@shared/_http/scheduler.service';
import { ToastService } from '@shared/services/toast.service';


@NgModule({
  declarations: [SchedulerLogsComponent,SchedulerComponent,CuvSchedulerComponent],
  imports: [
    CommonModule,
    SchedulerRoutingModule,
    FormComponent,
    TableComponent
  ],
  providers: [SchedulerService,ToastService]
})
export class SchedulerModule { }
