import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {HttpService} from '../../services/http.service';
import {MenuController} from '@ionic/angular';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    constructor(private router: Router, private dialog: Dialogs, private http: HttpService, private menu: MenuController) {
    }

    onLogout() {
        AuthService.logout();
        this.dialog.alert(`Successfully logged out`, 'Logout')
            .then(
                () => this.router.navigate(['login']));
    }

    openMenu() {
        this.menu.open().then(user => {
            console.log('Menu has been opened');
        });
    }

}
