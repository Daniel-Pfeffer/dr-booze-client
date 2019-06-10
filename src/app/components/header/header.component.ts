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
    newPermille = 0;
    tempStorage = [];



    constructor() {
        this.gkw = (<Person>JSON.parse(localStorage.getItem('person'))).gkw;
        this.timeSinceLastCalled = moment().subtract(10, 's');
        this.deconstructPerMinute = 0.1 / 60;
        this.alcoholInBlood = 0;
    }

    currentPerMille(): number {
        this.alcoholInBlood = 0;
        this.drinks = <Array<Drink>>JSON.parse(localStorage.getItem('drinks'));
        const drinksToSave: Array<Drink> = new Array<Drink>();
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
                    drinksToSave.push(drink);
                }
            });
        }
        localStorage.setItem('drinks', JSON.stringify(drinksToSave));
        if (this.alcoholInBlood > 0) {
            this.newPermille = Math.trunc(this.alcoholInBlood * 100) / 100;

            // Prüfen ob PromilleStorage im localStorage ist
            // Prüfen ob PromilleStorage im localStorage ist
            if (localStorage.getItem('permilleStorage')) {
                this.tempStorage = JSON.parse(localStorage.getItem('permilleStorage'));

                // Prüfen ob sich der Promillewert geändert hat
                if (this.tempStorage[this.tempStorage.length - 1].permille !== this.newPermille) {
                    this.tempStorage.push({
                        'time': moment().format('HH:mm'),
                        'permille': this.newPermille
                    });

                }

                // permilleStorage ist noch nicht im localStorage
            } else {
                this.tempStorage.push({
                    'time': moment().format('HH:mm'),
                    'permille': this.newPermille
                });
            }

            // PermilleStorage in den localStorage speichern
            localStorage.setItem('permilleStorage', JSON.stringify(this.tempStorage));

            return this.newPermille;
        }
        return 0;
    }

    calculateBAC(drink: Drink): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        // console.log(`A: ${a}`);
        return (0.8 * a) / (1.055 * this.gkw);
    }
}
