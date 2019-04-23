import {Component} from '@angular/core';
import {MenuController} from '@ionic/angular';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    constructor(private menu: MenuController) {
    }

    open() {
        this.menu.enable(true, 'profile').then(() => {
        });
    }
}
