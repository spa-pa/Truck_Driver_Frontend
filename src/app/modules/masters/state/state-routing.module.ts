import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateComponent } from './state.component';
import { CuStateComponent } from './cu-state/cu-state.component';

const routes: Routes = [
  {
    path: '', component: StateComponent,
    data: {
      title: "State",
      breadcrumb: "State",
    }
  },
  {
    path: 'create', component: CuStateComponent,
    data: {
      title: "Create State",
      breadcrumb: "Create State",
    }
  },
  {
    path: 'edit/:id', component: CuStateComponent,
    data: {
      title: "Edit State",
      breadcrumb: "Edit State",
    }
  },
  {
    path: 'view/:id', component: CuStateComponent,
    data: {
      title: "View State",
      breadcrumb: "View State",
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StateRoutingModule { }
