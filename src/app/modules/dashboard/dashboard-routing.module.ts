import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardNewComponent } from './dashboard-new/dashboard-new.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    data: {
      title: "Dashboard",
      breadcrumb: "Dashboard",
    }
  },

  {
    path: 'new-dashboard', component: DashboardNewComponent,
    data: {
      title: "NewDashboard",
      breadcrumb: "New Dashboard",
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
