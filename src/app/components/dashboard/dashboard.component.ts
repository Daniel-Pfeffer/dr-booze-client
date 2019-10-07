import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {DrinkCard} from '../../entities/drink-card';
import {AlcoholType} from '../../entities/alcohol';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
    cards: DrinkCard[] = [
        new DrinkCard(AlcoholType.BEER, 'Beer', 'beer', null),
        new DrinkCard(AlcoholType.WINE, 'Wine', 'wine', 'ios'),
        new DrinkCard(AlcoholType.COCKTAIL, 'Cocktails', 'wine', 'md'),
        new DrinkCard(AlcoholType.LIQUOR, 'Hard liquor', null, null)
    ];

    constructor(private router: Router) {
    }

    onCardClick(type: AlcoholType) {
        this.router.navigate(['picker-detail', type.toString()]);
    }
}
