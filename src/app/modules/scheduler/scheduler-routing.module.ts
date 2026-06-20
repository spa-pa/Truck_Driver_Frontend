import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { CuvSchedulerComponent } from './cuv-scheduler/cuv-scheduler.component';
import { SchedulerLogsComponent } from './scheduler-logs/scheduler-logs.component';

const routes: Routes = [{
  path: '', component: SchedulerComponent,
  data: {
    title: "Scheduler",
    breadcrumb: "Scheduler",
  }
},
{
  path: 'create', component: CuvSchedulerComponent,
  data: {
    title: "Create Scheduler",
    breadcrumb: "Create Scheduler",
  }
}
  ,
{
  path: 'edit/:id', component: CuvSchedulerComponent,
  data: {
    title: "Edit Scheduler",
    breadcrumb: "Edit Scheduler",
  }
},
{
  path: 'view/:id', component: CuvSchedulerComponent,
  data: {
    title: "View Scheduler",
    breadcrumb: "View Scheduler",
  },
},
{
  path: 'logs', component: SchedulerLogsComponent,
  data: {
    title: "Scheduler Logs",
    breadcrumb: "Scheduler Logs",
  }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerRoutingModule { }
