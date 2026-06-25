import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CountViewComponent } from '@shared/component/count-view/count-view.component';
import { DashboardService } from '@shared/_http/dashboard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    CountViewComponent
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
