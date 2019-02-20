import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    constructor(private router: Router, private dialog: Dialogs) {
    }

    onLogout() {
        AuthService.logout();
        this.dialog.alert(`Successfully logged out`, 'Logout')
            .then(
                () => this.router.navigate(['login']));
    }
}
