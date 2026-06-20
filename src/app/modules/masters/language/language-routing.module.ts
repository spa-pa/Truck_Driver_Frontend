import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageComponent } from './language.component';
import { CuLanguageComponent } from './cu-language/cu-language.component';

const routes: Routes = [
  {
      path: '', component: LanguageComponent,
      data: {
          title: "Language",
          breadcrumb: "Language",
      }
  },
  {
      path: 'create', component: CuLanguageComponent,
      data: {
          title: "Create Language",
          breadcrumb: "Create Language",
      }
  },
  {
      path: 'edit/:id', component: CuLanguageComponent,
      data: {
          title: "Edit Language",
          breadcrumb: "Edit Language",
      }
  },
  {
      path: 'view/:id', component: CuLanguageComponent,
      data: {
          title: "View Language",
          breadcrumb: "View Language",
      }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguageRoutingModule { }
