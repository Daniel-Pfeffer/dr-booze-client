import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {StatisticsMainComponent} from '../statistics-main/statistics-main.component';
import {InformationComponent} from '../information/information.component';
import {CalenderComponent} from '../calender/calender.component';
import {RegisteredGuard} from '../guards/registered.guard';
import {NeedRegisterGuard} from '../guards/need-register.guard';

const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [RegisteredGuard]},
    {path: '', component: RegisterComponent, canActivate: [RegisteredGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [RegisteredGuard]},
    {path: 'home', component: DashboardComponent, canActivate: [NeedRegisterGuard]},
    {path: 'stats', component: StatisticsMainComponent, canActivate: [NeedRegisterGuard]},
    {path: 'profile', component: InformationComponent, canActivate: [NeedRegisterGuard]},
    {path: 'activity', component: CalenderComponent, canActivate: [NeedRegisterGuard]},
    {path: '**', redirectTo: 'home'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
