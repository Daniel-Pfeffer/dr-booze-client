import {Component} from '@angular/core';
import {ProfileComponent} from '../profile/profile.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

    constructor(private profile: ProfileComponent, private router: Router) {
    }

    openProfile() {
        console.log('Open profile in menu');
        this.profile.openFirst();
    }
}
