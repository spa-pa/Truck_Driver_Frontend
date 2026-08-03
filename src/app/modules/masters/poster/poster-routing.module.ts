import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosterComponent } from './poster.component';
import { CuLanguageComponent } from '../language/cu-language/cu-language.component';
import { CuPosterComponent } from './cu-poster/cu-poster.component';

const routes: Routes = [
    {
        path: '', component: PosterComponent,
        data: {
            title: "Poster",
            breadcrumb: "Poster",
        }
    },
    {
        path: 'create', component: CuPosterComponent,
        data: {
            title: "Create Poster",
            breadcrumb: "Create Poster",
        }
    },
    {
        path: 'edit/:id', component: CuPosterComponent,
        data: {
            title: "Edit Poster",
            breadcrumb: "Edit Poster",
        }
    },
    {
        path: 'view/:id', component: CuPosterComponent,
        data: {
            title: "View Poster",
            breadcrumb: "View Poster",
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosterRoutingModule { }
