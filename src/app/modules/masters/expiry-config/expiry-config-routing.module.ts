import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpiryConfigComponent } from './expiry-config.component';
import { CuExpiryConfigComponent } from './cu-expiry-config/cu-expiry-config.component';

const routes: Routes = [
  {
    path: '', component: ExpiryConfigComponent,
    data: {
      title: "Certificate Expiry",
      breadcrumb: "certificate Expiry",
    }
  },
  {
    path: 'create', component: CuExpiryConfigComponent,
    data: {
      title: "Create Certificate Expiry",
      breadcrumb: "Create Certificate Expiry",
    }
  },
  {
    path: 'edit/:id', component: CuExpiryConfigComponent,
    data: {
      title: "Edit Certificate Expiry",
      breadcrumb: "Edit Certificate Expiry",
    }
  },
  {
    path: 'view/:id', component: CuExpiryConfigComponent,
    data: {
      title: "View Certificate Expiry",
      breadcrumb: "View Certificate Expiry",
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpiryConfigRoutingModule { }
