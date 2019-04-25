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
        this.alcoholInBlood = 0;
        this.drinks = <Array<Drink>>JSON.parse(localStorage.getItem('drinks'));
        if (this.drinks) {
            if (!this.gkw) {
                this.gkw = (<Person>JSON.parse(localStorage.getItem('person')).person).gkw;
            }
            this.drinks.forEach(drink => {
                drink.bak = this.calculateBAC(drink);
            });
            this.drinks.forEach(drink => {
                // in minutes
                const timeSinceDrank = moment().diff(drink.timeWhenDrank, 'm');
                if ((drink.bak / this.deconstructPerMinute) > timeSinceDrank) {
                    this.alcoholInBlood += drink.bak - timeSinceDrank * this.deconstructPerMinute;
                }
            });
        }
        if (this.alcoholInBlood > 0) {
            return this.alcoholInBlood;
        }
        return 0;
    }


    calculateBAC(drink: Drink): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        console.log(`A: ${a}`);
        return (0.8 * a) / (1.055 * this.gkw);
    }
}
