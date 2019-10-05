import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {DatePicker} from '@ionic-native/date-picker/ngx';
import {Toast} from '@ionic-native/toast/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';

import {GoogleChartsModule} from 'angular-google-charts';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './modules/app-routing.module';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ProfileComponent} from './components/profile/profile.component';
import {PickerDetailComponent} from './components/picker-detail/picker-detail.component';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {SwitchError} from './helper/switch-error';
import {DisplayPermilleComponent} from './components/display-permille/display-permille.component';
import {NgCalendarModule} from 'ionic2-calendar';
import {RequestPasswordChangeComponent} from './components/request-password-change/request-password-change.component';
import {StatisticsComponent} from './components/statistics/statistics.component';
import {MapComponent} from './components/map/map.component';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        DashboardComponent,
        ProfileComponent,
        PickerDetailComponent,
        StatisticsComponent,
        SideMenuComponent,
        DisplayPermilleComponent,
        RequestPasswordChangeComponent,
        MapComponent
    ],
    entryComponents: [],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot({
            scrollPadding: true,
            scrollAssist: false,
        }),
        AppRoutingModule,
        NgCalendarModule,
        GoogleChartsModule.forRoot()
    ],
    providers: [
        SwitchError,
        DatePicker,
        Dialogs,
        StatusBar,
        SplashScreen,
        Keyboard,
        Toast,
        SideMenuComponent,
        DashboardComponent,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
