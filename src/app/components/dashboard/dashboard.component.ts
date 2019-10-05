import {Component} from '@angular/core';
import {Router} from '@angular/router';
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
        new DrinkCard(DrinkType.LIQUOR, 'Hard liquor', null, null)
        // new DrinkCard(DrinkType.OTHER, 'Other', '')
    ];

    constructor(private router: Router) {
    }

    onCardClick(type: DrinkType) {
        this.router.navigate(['picker-detail', type]);
    }

}
