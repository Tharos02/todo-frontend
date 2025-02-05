import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {LayoutComponent} from './layout/layout.component';
import {BoardComponent} from './board/board.component';
import {AuthGuard} from './auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: 'board', component: BoardComponent, canActivate: [AuthGuard]}
    ],
    canActivate: [AuthGuard]
  }
];
