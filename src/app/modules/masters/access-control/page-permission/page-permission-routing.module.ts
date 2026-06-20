import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagePermissionComponent } from './page-permission.component';
import { ModifyPagePermissionComponent } from './modify-page-permission/modify-page-permission.component';

const routes: Routes = [
  {
    path: '', component: PagePermissionComponent,
    data: {
        title: "Pages",
        breadcrumb: "Pages",
    }
  },
  {
      path: 'create', component: ModifyPagePermissionComponent,
      data: {
          title: "Create Permission",
          breadcrumb: "Create Permission",
      }
  },
  {
    path: 'edit/:id', component: ModifyPagePermissionComponent,
    data: {
        title: "Edit page Permission",
        breadcrumb: "Edit page Permission",
    }
  },
  {
      path: 'view/:id', component: ModifyPagePermissionComponent,
      data: {
          title: "View page Permission",
          breadcrumb: "View page Permission",
      }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagePermissionRoutingModule { }
