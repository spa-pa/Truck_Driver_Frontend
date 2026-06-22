import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverTrainingListComponent } from './driver-training-list.component';

const routes: Routes = [
  {
    path: '', component: DriverTrainingListComponent,
    data: {
      title: "Driver Training List",
      breadcrumb: "Driver Training List",
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverTrainingListRoutingModule { }
