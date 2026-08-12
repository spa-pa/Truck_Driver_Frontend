import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpiryConfigComponent } from './expiry-config.component';
import { CuExpiryConfigComponent } from './cu-expiry-config/cu-expiry-config.component';

const routes: Routes = [
  {
    path: '', component: ExpiryConfigComponent,
    data: {
      title: "Certification Config",
      breadcrumb: "Certification Config",
    }
  },
  {
    path: 'create', component: CuExpiryConfigComponent,
    data: {
      title: "Create Certification Config",
      breadcrumb: "Create Certification Config",
    }
  },
  {
    path: 'edit/:id', component: CuExpiryConfigComponent,
    data: {
      title: "Edit Certification Config",
      breadcrumb: "Edit Certification Config",
    }
  },
  {
    path: 'view/:id', component: CuExpiryConfigComponent,
    data: {
      title: "View Certification Config",
      breadcrumb: "View Certification Config",
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpiryConfigRoutingModule { }
