import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../components/login/login.component';
import {RegisterComponent} from '../components/register/register.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {ProfileComponent} from '../components/profile/profile.component';
import {RegisteredGuard} from '../guards/registered.guard';
import {NeedRegisterGuard} from '../guards/need-register.guard';
import {RequestPasswordChangeComponent} from '../components/request-password-change/request-password-change.component';
import {PickerDetailComponent} from '../components/picker-detail/picker-detail.component';
import {StatisticsComponent} from '../components/statistics/statistics.component';
import {MapComponent} from '../components/map/map.component';
import {HistoryComponent} from '../components/history/history.component';

const routes: Routes = [
    {path: '', component: LoginComponent, canActivate: [RegisteredGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [RegisteredGuard]},
    {path: 'request-password-change', component: RequestPasswordChangeComponent, canActivate: [RegisteredGuard]},
    {path: 'home', component: DashboardComponent, canActivate: [NeedRegisterGuard]},
    {path: 'stats', component: StatisticsComponent, canActivate: [NeedRegisterGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [NeedRegisterGuard]},
    {path: 'picker-detail/:type', component: PickerDetailComponent, canActivate: [NeedRegisterGuard]},
    {path: 'map', component: MapComponent, canActivate: [NeedRegisterGuard]},
    {path: 'history', component: HistoryComponent, canActivate: [NeedRegisterGuard]},
    {path: '**', redirectTo: 'home'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
