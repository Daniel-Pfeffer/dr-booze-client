import {Component} from '@angular/core';
import {Drink} from '../../interfaces/drink';
import {Person} from '../../entities/person';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    drinks = new Array<Drink>();
    gkw: number;

    currentPerMille(): string {
        if (localStorage.getItem('person')) {
            this.gkw = this.calculateGKW();
        }
        this.drinks = <Array<Drink>>JSON.parse(localStorage.getItem('drinks'));
        if (this.drinks) {
            this.drinks.forEach(drink => {
                drink.bak = this.calculateBAC(drink);
            });
        }
        return 'insert current per mille here';
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
