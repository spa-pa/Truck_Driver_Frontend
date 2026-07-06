import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpiryConfigComponent } from './expiry-config.component';
import { CuExpiryConfigComponent } from './cu-expiry-config/cu-expiry-config.component';

const routes: Routes = [
  {
    path: '', component: ExpiryConfigComponent,
    data: {
      title: "Expiry Config",
      breadcrumb: "Expiry Config",
    }
  },
  {
    path: 'create', component: CuExpiryConfigComponent,
    data: {
      title: "Create Expiry Config",
      breadcrumb: "Create Expiry Config",
    }
  },
  {
    path: 'edit/:id', component: CuExpiryConfigComponent,
    data: {
      title: "Edit Expiry Config",
      breadcrumb: "Edit Expiry Config",
    }
  },
  {
    path: 'view/:id', component: CuExpiryConfigComponent,
    data: {
      title: "View Expiry Config",
      breadcrumb: "View Expiry Config",
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpiryConfigRoutingModule { }
