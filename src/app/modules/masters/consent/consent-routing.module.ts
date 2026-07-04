import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsentComponent } from './consent.component';
import { CuConsentComponent } from './cu-consent/cu-consent.component';

const routes: Routes = [
  {
      path: '', component: ConsentComponent,
      data: {
        title: "Consent",
        breadcrumb: "Consent",
      }
    },
    {
      path: 'create', component: CuConsentComponent,
      data: {
        title: "Create Consent",
        breadcrumb: "Create Consent",
      }
    },
    {
      path: 'edit/:id', component: CuConsentComponent,
      data: {
        title: "Edit Consent",
        breadcrumb: "Edit Consent",
      }
    },
    {
      path: 'view/:id', component: CuConsentComponent,
      data: {
        title: "View Consent",
        breadcrumb: "View Consent",
      }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsentRoutingModule { }
