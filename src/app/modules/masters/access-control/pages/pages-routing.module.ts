import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ModifyPagesComponent } from './modify-pages/modify-pages.component';

const routes: Routes = [
  {
    path: '', component: PagesComponent,
    data: {
        title: "Pages",
        breadcrumb: "Pages",
    }
  },
  {
      path: 'create', component: ModifyPagesComponent,
      data: {
          title: "Create Pages",
          breadcrumb: "Create Pages",
      }
  },
  {
    path: 'edit/:id', component: ModifyPagesComponent,
    data: {
        title: "Edit Pages",
        breadcrumb: "Edit Pages",
    }
  },
  {
      path: 'view/:id', component: ModifyPagesComponent,
      data: {
          title: "View Pages",
          breadcrumb: "View Pages",
      }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
