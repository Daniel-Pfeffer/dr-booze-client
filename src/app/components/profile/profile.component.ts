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

    /*openFirst() {
        this.menu.enable(true, 'profile2').then(() => {
            this.menu.open().then(() => {
                console.log('Profile should be open in controller');
                this.menu.isOpen().then(() => {
                    console.log('Profile is open in controller');
                });
            });
        });
    }*/
}
