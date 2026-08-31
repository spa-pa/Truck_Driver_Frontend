import { Routes } from '@angular/router';
import { ContentComponent } from './shared/component/layout/content/content.component';
import { dashData } from './shared/routes/routes';
import { LoginComponent } from './auth/login/login.component';
import { ErrorPageComponent } from '@shared/component/error-page/error-page.component';
import { AdminGuard } from '@shared/guard/admin.guard';
import { TrainingComponent } from '@modules/masters/training/training.component';
import { ChatComponent } from '@modules/chatbot/chat-component/chat-component.component';


export const routes: Routes = [
    {
        path: 'auth/login',
        component: LoginComponent
    },
    {
        path: 'safety-training',
        component: TrainingComponent
    },
     {
        path: 'chat',
        component: ChatComponent
    },
    {
        path: '',
        component: ContentComponent,
        children: dashData,
        canActivate: [AdminGuard],
    }, 
    {
        path: '**',
        component: ErrorPageComponent
    }
];
