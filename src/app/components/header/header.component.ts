import {Component} from '@angular/core';
import {Drink} from '../../interfaces/drink';
import {Person} from '../../entities/person';
import * as moment from 'moment';
import {Moment} from 'moment';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    drinks = new Array<Drink>();
    gkw: number;
    alcoholInBlood: number;
    deconstructPerMinute: number;
    timeSinceLastCalled: Moment;

    constructor() {
        this.gkw = (<Person>JSON.parse(localStorage.getItem('person'))).gkw;
        this.timeSinceLastCalled = moment().subtract(10, 's');
        this.deconstructPerMinute = 0.1 / 60;
        this.alcoholInBlood = 0;
    }

    currentPerMille(): number {
        const now = moment();
        if ((this.timeSinceLastCalled.add(5, 'm')).isAfter(now)) {
            this.drinks = <Array<Drink>>JSON.parse(localStorage.getItem('drinks'));
            if (this.drinks) {
                if (!this.gkw) {
                    return 0;
                }
                this.drinks.forEach(drink => {
                    drink.bak = this.calculateBAC(drink);
                });
                console.table(this.drinks);
                this.drinks.forEach(drink => {
                    // in minutes
                    const timeSinceDrank = now.subtract(drink.timeWhenDrank, 'ms').get('m');
                    if ((drink.bak / this.deconstructPerMinute) > timeSinceDrank) {
                        this.alcoholInBlood += drink.bak - timeSinceDrank * this.deconstructPerMinute;
                    }
                    console.log(this.alcoholInBlood);
                });
            }
            this.timeSinceLastCalled = moment();
            if (this.alcoholInBlood > 0) {
                return this.alcoholInBlood;
            }
        }
        return 0;
    }


    calculateBAC(drink: Drink): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        return (0.8 * a) / (1.055 * this.gkw);
    }
}
