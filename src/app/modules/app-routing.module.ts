import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../components/login/login.component';
import {RegisterComponent} from '../components/register/register.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {InformationComponent} from '../components/information/information.component';
import {RegisteredGuard} from '../guards/registered.guard';
import {NeedRegisterGuard} from '../guards/need-register.guard';
import {RequestPasswordChangeComponent} from '../components/request-password-change/request-password-change.component';
import {PickerDetailComponent} from '../components/picker-detail/picker-detail.component';
import {StatisticsComponent} from '../components/statistics/statistics.component';
import {MapComponent} from '../components/map/map.component';


const routes: Routes = [
    {path: '', component: RegisterComponent, canActivate: [RegisteredGuard]},
    {path: 'login', component: LoginComponent, canActivate: [RegisteredGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [RegisteredGuard]},
    {path: 'home', component: DashboardComponent, canActivate: [NeedRegisterGuard]},
    {path: 'stats', component: StatisticsComponent, canActivate: [NeedRegisterGuard]},
    {path: 'profile', component: InformationComponent, canActivate: [NeedRegisterGuard]},
    {path: 'request-password-change', component: RequestPasswordChangeComponent, canActivate: [RegisteredGuard]},
    {path: 'pickerDetail/:type', component: PickerDetailComponent, canActivate: [NeedRegisterGuard]},
    {path: 'map', component: MapComponent, canActivate: [NeedRegisterGuard]},
    {path: '**', redirectTo: 'home'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
