import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CountViewComponent } from '@shared/component/count-view/count-view.component';
import { DashboardService } from '@shared/_http/dashboard.service';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CountViewComponent
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
