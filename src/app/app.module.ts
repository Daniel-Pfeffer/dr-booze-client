import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './modules/app-routing.module';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {CalenderComponent} from './components/calender/calender.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {InformationComponent} from './components/information/information.component';
import {ChallengesComponent} from './components/challenges/challenges.component';
import {PickMainComponent} from './components/pick-main/pick-main.component';
import {PickerComponent} from './components/pick-main/picker/picker.component';
import {PickerDetailComponent} from './components/pick-main/picker/picker-detail/picker-detail.component';
import {StatisticsMainComponent} from './components/statistics-main/statistics-main.component';
import {StatisticsComponent} from './components/statistics-main/statistics/statistics.component';
import {StatisticsDetailComponent} from './components/statistics-main/statistics/statistics-detail/statistics-detail.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {DatePicker} from '@ionic-native/date-picker/ngx';
import {ProfileComponent} from './components/profile/profile.component';
import {SwitchError} from './helper/switch-error';
import {HeaderComponent} from './components/header/header.component';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        CalenderComponent,
        DashboardComponent,
        InformationComponent,
        ChallengesComponent,
        PickMainComponent,
        PickerComponent,
        PickerDetailComponent,
        StatisticsMainComponent,
        StatisticsComponent,
        StatisticsDetailComponent,
        ProfileComponent,
        HeaderComponent
    ],
    entryComponents: [],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(),
        AppRoutingModule
    ],
    providers: [
        SwitchError,
        DatePicker,
        Dialogs,
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
