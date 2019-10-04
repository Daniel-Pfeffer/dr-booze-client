import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Drink} from '../interfaces/drink';
import {DataService} from './data.service';
import {Person} from '../entities/person';

@Injectable({
    providedIn: 'root'
})
export class PerMilleCalculationService {

    static perMilleNotifier = new BehaviorSubject<number>(0);

    perMilleObservable = PerMilleCalculationService.perMilleNotifier.asObservable();

    constructor(private data: DataService) {
    }

    static addDrink() {
        const curValue: number = PerMilleCalculationService.perMilleNotifier.value;
        PerMilleCalculationService.perMilleNotifier.next(curValue);
    }

    private calculateBAC(drink: Drink): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        return (0.8 * a) / (1.055 * (<Person>this.data.getData('person')).gkw);
    }


}
