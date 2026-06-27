import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverEntryListComponent } from './driver-entry-list.component';

const routes: Routes = [
  {
    path: '', component: DriverEntryListComponent,
    data: {
      title: "Driver Entries",
      breadcrumb: "Driver Entries",
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverEntryListRoutingModule { }
