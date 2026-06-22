import { Routes } from '@angular/router';

const mastersData: Routes = [
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
        loadChildren: () => import('../../modules/dashboard/dashboard-routing.module').then(r => r.DashboardRoutingModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'city',
        data: {
            title: "City",
            breadcrumb: "City",
            pageId: 2
        },
        loadChildren: () => import('../../modules/masters/city/city.module').then(r => r.CityModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'country',
        data: {
            title: "Country",
            breadcrumb: "Country",
            pageId: 4
        },
        loadChildren: () => import('../../modules/masters/country/country.module').then(r => r.CountryModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'state',
        data: {
            title: "State",
            breadcrumb: "State",
            pageId: 3
        },
        loadChildren: () => import('../../modules/masters/state/state.module').then(r => r.StateModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'language',
        data: {
            title: "Language",
            breadcrumb: "Language",
            pageId: 2
        },
        loadChildren: () => import('../../modules/masters/language/language.module').then(r => r.LanguageModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'terminal',
        data: {
            title: "Terminal",
            breadcrumb: "Terminal",
            pageId: 9
        },
        loadChildren: () => import('../../modules/masters/terminal/terminal.module').then(r => r.TerminalModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'video-configuration',
        data: {
            title: "Video Configuration",
            breadcrumb: "Video Configuration",
            pageId: 2
        },
        loadComponent: () => import('../../modules/video-config/video-config.component').then(r => r.VideoConfigComponent),
        //loadChildren: () => import('../../modules/video-config/video-config.module').then(r => r.VideoConfigModule),
        //loadChildren: () => import('../../modules/video-config/video-config-routing.module').then(r => r.VideoConfigRoutingModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'quiz-configuration',
        data: {
            title: "Quiz Configuration",
            breadcrumb: "Quiz Configuration",
            pageId: 2
        },
        loadComponent: () => import('../../modules/quiz-config/quiz-config.component').then(r => r.QuizConfigComponent)
        //loadChildren: () => import('../../modules/quiz-config/quiz-config.module').then(r => r.QuizConfigModule),
        //loadChildren: () => import('../../modules/quiz-config/quiz-config-routing.module').then(r => r.QuizConfigRoutingModule),
    },
    {
        path: 'qr-scan-details',
        data: {
            title: "QR Scanner",
            breadcrumb: "QR Scanner",
            pageId: 2
        },
        loadComponent: () => import('../../modules/masters/QR-Operation/qr-scan-driver-details/qr-scan-driver-details.component').then(r => r.QRScanDriverDetailsComponent),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'qr-code-config',
        data: {
            title: "QR Code Config",
            breadcrumb: "QR Code Config",
            pageId: 2
        },
        loadComponent: () => import('../../modules/masters/QR-Operation/qr-code/qr-editor/qr-editor.component').then(r => r.QREditorComponent),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'training-result',
        data: {
            title: "Training Results",
            breadcrumb: "Training Results",
            pageId: 2
        },
        loadChildren: () => import('../../modules/masters/driver/driver-training-list/driver-training-list.module').then(r => r.DriverTrainingListModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'training',
        data: {
            title: "Training",
            breadcrumb: "Training",
            pageId: 2
        },
        loadComponent: () => import('../../modules/masters/QR-Operation/qr-code/qr-editor/qr-editor.component').then(r => r.QREditorComponent),
        // canActivate: [PermissionGuard]
    }




]



const pagePermissionRoutes: Routes = [
    // SECURITY
    {
        path: 'permission',
        data: {
            title: "Permission",
            breadcrumb: "permission",
            pageId: 7,
        },
        loadChildren: () => import('@modules/masters/access-control/permission/permission.module').then(r => r.PermissionModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'pages',
        data: {
            title: "Pages",
            breadcrumb: "pages",
            pageId: 8,
        },
        loadChildren: () => import('@modules/masters/access-control/pages/pages.module').then(r => r.PagesModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'page-permission',
        data: {
            title: "Page permission",
            breadcrumb: "page-permission",
            pageId: 9,
        },
        loadChildren: () => import('@modules/masters/access-control/page-permission/page-permission.module').then(r => r.PagePermissionModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'role',
        data: {
            title: "Role",
            breadcrumb: "role",
            pageId: 10,
        },
        loadChildren: () => import('@modules/masters/access-control/role/role.module').then(r => r.RoleModule),
        // canActivate: [PermissionGuard]
    },
    {
        path: 'role-permission',
        data: {
            title: "Role page permission",
            breadcrumb: "role-permission",
            pageId: 11,
        },
        loadChildren: () => import('@modules/masters/access-control/role-page-permission/role-page-permission.module').then(r => r.RolePagePermissionModule),
        // canActivate: [PermissionGuard]
    },
]


export const dashData: Routes = [
    ...mastersData,
    ...pagePermissionRoutes
]

