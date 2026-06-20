import { Routes } from '@angular/router';

export const dashData: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        data: {
            title: "Dashboard",
            breadcrumb: "Dashboard",
            pageId: 1
        },
        loadChildren: () => import('../../modules/dashboard/dashboard.module').then(r => r.DashboardModule),
    }
]

