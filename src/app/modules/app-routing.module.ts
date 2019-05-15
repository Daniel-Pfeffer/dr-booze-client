import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../components/login/login.component';
import {RegisterComponent} from '../components/register/register.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {StatisticsMainComponent} from '../components/statistics-main/statistics-main.component';
import {InformationComponent} from '../components/information/information.component';
import {CalenderComponent} from '../components/calender/calender.component';
import {RegisteredGuard} from '../guards/registered.guard';
import {NeedRegisterGuard} from '../guards/need-register.guard';
import {PickerDetailComponent} from '../components/picker-detail/picker-detail.component';
import {PickerComponent} from '../components/picker/picker.component';

const routes: Routes = [
    {path: '', component: RegisterComponent, canActivate: [RegisteredGuard]},
    {path: 'login', component: LoginComponent, canActivate: [RegisteredGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [RegisteredGuard]},
    {path: 'home', component: DashboardComponent, canActivate: [NeedRegisterGuard]},
    {path: 'stats', component: StatisticsMainComponent, canActivate: [NeedRegisterGuard]},
    {path: 'profile', component: InformationComponent, canActivate: [NeedRegisterGuard]},
    {path: 'activity', component: CalenderComponent, canActivate: [NeedRegisterGuard]},
    {path: 'pickerDetail', component: PickerDetailComponent, canActivate: [NeedRegisterGuard]},
    {path: 'picker', component: PickerComponent, canActivate: [NeedRegisterGuard]},
    {path: 'calendar', component: CalenderComponent, canActivate: [NeedRegisterGuard]},
    {path: '**', redirectTo: 'home'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
