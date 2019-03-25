import {Component} from '@angular/core';
import {ProfileComponent} from '../profile/profile.component';
import {DashboardComponent} from '../dashboard/dashboard.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

    constructor(private dash: DashboardComponent) {
    }


    openProfile() {
        console.log('Open profile in menu');
        this.dash.openMenu();
    }
}
