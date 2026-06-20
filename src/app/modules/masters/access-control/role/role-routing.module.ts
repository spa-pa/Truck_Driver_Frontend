import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyRoleComponent } from './modify-role/modify-role.component';
import { RoleComponent } from './role.component';

const routes: Routes = [
  {
    path: '', component: RoleComponent,
    data: {
        title: "Role List",
        breadcrumb: "Role List",
    }
},
{
    path: 'create', component: ModifyRoleComponent,
    data: {
        title: "Role Create",
        breadcrumb: "Role Create",
    }
},
{
    path: 'edit/:id', component: ModifyRoleComponent,
    data: {
        title: "Edit Role",
        breadcrumb: "Edit Role",
    }
},
{
    path: 'view/:id', component: ModifyRoleComponent,
    data: {
        title: "View Role",
        breadcrumb: "View Role",
    }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
