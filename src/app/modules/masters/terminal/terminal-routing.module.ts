import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuTerminalComponent } from './cu-terminal/cu-terminal.component';
import { TerminalComponent } from './terminal.component';

const routes: Routes = [
   {
        path: '', component: TerminalComponent,
        data: {
            title: "Terminal",
            breadcrumb: "Terminal",
        }
    },
    {
        path: 'create', component: CuTerminalComponent,
        data: {
            title: "Create Terminal",
            breadcrumb: "Create Terminal",
        }
    },
    {
        path: 'edit/:id', component: CuTerminalComponent,
        data: {
            title: "Edit Terminal",
            breadcrumb: "Edit Terminal",
        }
    },
    {
        path: 'view/:id', component: CuTerminalComponent,
        data: {
            title: "View Terminal",
            breadcrumb: "View Terminal",
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminalRoutingModule { }
