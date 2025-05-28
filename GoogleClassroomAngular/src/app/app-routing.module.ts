import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { ChattingPageComponent } from './groupchat/chatting-page/chatting-page.component';
import { loginGuard } from './auth/login.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: '', component: WelcomeComponent, canActivate: [loginGuard] },

  {
    path: 'chatting-site',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'chatting-site/group/:groupId',
    component: DashboardComponent,
    canActivate: [authGuard]
  }


  // {
  //   path: 'chatting-site',
  //   component: DashboardComponent,
  //   canActivate: [authGuard],
  //   children: [
  //     { path: '', component: DashboardComponent },
  //     { path: 'group/:groupId', component: DashboardComponent },
  //   ]
  // }


  // { path: 'chatting-site', component: DashboardComponent, canActivate: [authGuard] },
  // { path: 'group-chat/:groupId', component: ChattingPageComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
