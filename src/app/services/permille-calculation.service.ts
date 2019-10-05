import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Drink} from '../interfaces/drink';
import {DataService} from './data.service';
import {User} from '../entities/user';

@Injectable({
    providedIn: 'root'
})
export class PermilleCalculationService {

    static perMilleNotifier = new BehaviorSubject<number>(0);

    perMilleObservable = PermilleCalculationService.perMilleNotifier.asObservable();

    constructor(private data: DataService) {
    }

    static addDrink() {
        const curValue: number = PermilleCalculationService.perMilleNotifier.value;
        PermilleCalculationService.perMilleNotifier.next(curValue);
    }

    private calculateBAC(drink: Drink): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        return (0.8 * a) / (1.055 * (<User>this.data.getData('user')).gkw);
    }


}
