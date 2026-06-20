import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city.component';
import { CuCityComponent } from './cu-city/cu-city.component';

const routes: Routes = [
{
    path: '', component: CityComponent,
    data: {
        title: "City",
        breadcrumb: "City",
    }
},
{
    path: 'create', component: CuCityComponent,
    data: {
        title: "Create City",
        breadcrumb: "Create City",
    }
},
{
    path: 'edit/:id', component: CuCityComponent,
    data: {
        title: "Edit City",
        breadcrumb: "Edit City",
    }
},
{
    path: 'view/:id', component: CuCityComponent,
    data: {
        title: "View City",
        breadcrumb: "View City",
    }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
