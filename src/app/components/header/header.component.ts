import {Component} from '@angular/core';
import {Drink} from '../../interfaces/drink';
import {Person} from '../../entities/person';
import * as moment from 'moment';
import {DurationInputArg2, Moment} from 'moment';

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
        this.timeSinceLastCalled = moment().subtract(5, 'd');
        this.deconstructPerMinute = 0.1 / 60;
        this.alcoholInBlood = 0;
        if (localStorage.getItem('person')) {
            if ((<Person>JSON.parse(localStorage.getItem('person'))).birthday != null) {
                if (!(<Person>JSON.parse(localStorage.getItem('person'))).gkw) {
                    this.gkw = this.calculateGKW();
                } else {
                    this.gkw = (<Person>JSON.parse(localStorage.getItem('person'))).gkw;
                }
            }
        }
    }

    currentPerMille(): number {
        const now = moment();
        if ((this.timeSinceLastCalled.add(5, 'm')).isAfter(now)) {
            console.log('calculation exec');
            this.drinks = <Array<Drink>>JSON.parse(localStorage.getItem('drinks'));
            if (this.drinks) {
                if (!this.gkw) {
                    this.calculateGKW();
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

    calculateGKW(): number {
        const person: Person = JSON.parse(localStorage.getItem('person')).person;
        const age = new Date().getFullYear() - new Date(person.birthday).getFullYear();
        switch (person.gender) {
            case 'M':
                const c = 2.447 - (0.09516 * age) + (0.1074 * person.height) + (0.3362 * person.weight);
                console.log(c);
                return c;

            case 'W':
                const cd = -2.097 + (0.1069 * person.height) + (0.2466 * person.weight);
                console.log(cd);
                return cd;
        }
    }

    calculateBAC(drink: Drink): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        return (0.8 * a) / (1.055 * this.gkw);
    }
}
