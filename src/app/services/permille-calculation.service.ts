import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Drink} from '../entities/drink';
import {DataService} from './data.service';
import {User} from '../entities/user';
import {Alcohol} from '../entities/alcohol';

@Injectable({
    providedIn: 'root'
})
export class PermilleCalculationService {

    static perMilleNotifier = new BehaviorSubject<number>(0);

    perMilleObservable = PermilleCalculationService.perMilleNotifier.asObservable();

    constructor(private data: DataService) {
    }

    public addDrink(drink: Drink) {
        let curValue: number = PermilleCalculationService.perMilleNotifier.value;
        curValue += this.calculateBAC(drink.alcohol);
        PermilleCalculationService.perMilleNotifier.next(curValue);
    }

    private calculateBAC(drink: Alcohol): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        return (0.8 * a) / (1.055 * (<User>this.data.getData('user')).gkw);
    }


}
