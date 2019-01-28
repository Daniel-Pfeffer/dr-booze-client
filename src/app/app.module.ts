import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './modules/app-routing.module';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {CalenderComponent} from './calender/calender.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AfterRegisterComponent} from './dialogs/after-register/after-register.component';
import {InformationComponent} from './information/information.component';
import {ChallengesComponent} from './information/challenges/challenges.component';
import {PickMainComponent} from './pick-main/pick-main.component';
import {PickerComponent} from './pick-main/picker/picker.component';
import {PickerDetailComponent} from './pick-main/picker/picker-detail/picker-detail.component';
import {StatisticsMainComponent} from './statistics-main/statistics-main.component';
import {StatisticsComponent} from './statistics-main/statistics/statistics.component';
import {StatisticsDetailComponent} from './statistics-main/statistics/statistics-detail/statistics-detail.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {Dialogs} from '@ionic-native/dialogs/ngx';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        CalenderComponent,
        DashboardComponent,
        AfterRegisterComponent,
        InformationComponent,
        ChallengesComponent,
        PickMainComponent,
        PickerComponent,
        PickerDetailComponent,
        StatisticsMainComponent,
        StatisticsComponent,
        StatisticsDetailComponent
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
        Dialogs,
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
