import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverTrainingListComponent } from './driver-training-list.component';
import { CuDriverTrainingListComponent } from './cu-driver-training-list/cu-driver-training-list.component';

const routes: Routes = [
  {
    path: '', component: DriverTrainingListComponent,
    data: {
      title: "Driver Training List",
      breadcrumb: "Driver Training List",
    }
  },
  {
    path: 'edit/:id', component: CuDriverTrainingListComponent,
    data: {
      title: "Edit Driver Training List",
      breadcrumb: "Edit Driver Training List",
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverTrainingListRoutingModule { }
