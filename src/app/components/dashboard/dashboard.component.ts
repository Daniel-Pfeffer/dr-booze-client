import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';

import {DrinkPicker} from '../../entities/drinkPicker';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    drinkCards: Array<DrinkPicker>;
    private route: ActivatedRoute;

    constructor(private router: Router, private dialog: Dialogs) {
        this.drinkCards = new Array<DrinkPicker>();
        this.drinkCards.push(new DrinkPicker('Bier und Wein', '../../../assets/background.jpg', 1));
        this.drinkCards.push(new DrinkPicker('Cocktails', '../../../assets/background.jpg', 2));
        this.drinkCards.push(new DrinkPicker('Spirituosen', '../../../assets/background.jpg', 3));
        this.drinkCards.push(new DrinkPicker('Mehr', '../../../assets/background.jpg', 4));
    }

    onClick(cardid: number) {
        this.router.navigate(['pickerDetail'], {queryParams: { id: cardid}});
    }

    onLogout() {
        AuthService.logout();
        this.dialog.alert(`Successfully logged out`, 'Logout')
            .then(
                () => this.router.navigate(['login']));
    }

}
