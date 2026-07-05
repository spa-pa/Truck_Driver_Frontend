import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserMasterComponent } from './user-master.component';
import { CuUserMasterComponent } from './cu-user-master/cu-user-master.component';

const routes: Routes = [
  {
    path: '', component: UserMasterComponent,
    data: {
      title: "User",
      breadcrumb: "User",
    }
  },
  {
    path: 'create', component: CuUserMasterComponent,
    data: {
      title: "Create User",
      breadcrumb: "Create User",
    }
  },
  {
    path: 'edit/:id', component: CuUserMasterComponent,
    data: {
      title: "Edit User",
      breadcrumb: "Edit User",
    }
  },
  {
    path: 'view/:id', component: CuUserMasterComponent,
    data: {
      title: "View User",
      breadcrumb: "View User",
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMasterRoutingModule { }
