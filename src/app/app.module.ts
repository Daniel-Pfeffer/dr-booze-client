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
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {SecureStorage} from '@ionic-native/secure-storage/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';

import {GoogleChartsModule} from 'angular-google-charts';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './modules/app-routing.module';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ProfileComponent} from './components/profile/profile.component';
import {PickerDetailComponent} from './components/picker-detail/picker-detail.component';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {DisplayPermilleComponent} from './components/display-permille/display-permille.component';
import {RequestPasswordChangeComponent} from './components/request-password-change/request-password-change.component';
import {StatisticsComponent} from './components/statistics/statistics.component';
import {MapComponent} from './components/map/map.component';
import {ModalDrinkListComponent} from './components/map/modal-drink-list/modal-drink-list.component';
import {Network} from '@ionic-native/network/ngx';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

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
        MapComponent,
        ModalDrinkListComponent
    ],
    entryComponents: [
        ModalDrinkListComponent
    ],
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
        GoogleChartsModule.forRoot()
    ],
    providers: [
        DatePicker,
        Dialogs,
        StatusBar,
        SplashScreen,
        Keyboard,
        Toast,
        Geolocation,
        SideMenuComponent,
        DashboardComponent,
        SecureStorage,
        NativeStorage,
        Network,
        BackgroundMode,
        LocalNotifications,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
