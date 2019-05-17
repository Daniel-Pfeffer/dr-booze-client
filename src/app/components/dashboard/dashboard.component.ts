import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {DrinkCard} from '../../entities/drinkCard';
import {DrinkType} from '../../interfaces/drink';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    cards: DrinkCard[] = [
        new DrinkCard(DrinkType.BEER, 'Beer', 'beer', null),
        new DrinkCard(DrinkType.WINE, 'Wine', 'wine', 'ios'),
        new DrinkCard(DrinkType.COCKTAIL, 'Cocktails', 'wine', 'md'),
        new DrinkCard(DrinkType.LIQUOR, 'Hard liquor', 'wine', 'md')
        // new DrinkCard(DrinkType.OTHER, 'Other', '')
    ];

    constructor(private router: Router, private dialog: Dialogs) {
    }

    onCardClick(type: DrinkType) {
        this.router.navigate(['pickerDetail', type]);
    }

    onLogout() {
        AuthService.logout();
        this.dialog.alert(`Successfully logged out`, 'Logout')
            .then(() => this.router.navigate(['login']));
    }

}
