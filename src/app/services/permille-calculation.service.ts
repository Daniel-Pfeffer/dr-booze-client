import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Drink} from '../entities/drink';
import {DataService} from './data.service';
import {User} from '../entities/user';
import {Alcohol} from '../entities/alcohol';
import {TimingService} from './timing.service';
import {StorageService} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class PermilleCalculationService {

    static perMilleNotifier = new BehaviorSubject<number>(0);

    perMilleObservable = PermilleCalculationService.perMilleNotifier.asObservable();

    constructor(private data: DataService, private timing: TimingService) {
        timing.start();
        this.timing.subject.asObservable().subscribe(item => {
            console.log('5sec passed');
            let curValue: number = PermilleCalculationService.perMilleNotifier.value;
            if (curValue > 0) {
                curValue -= (0.1 / 60);
            }
            PermilleCalculationService.perMilleNotifier.next(curValue);
        });
    }

    public addDrink(drink: Drink) {
        let curValue: number = PermilleCalculationService.perMilleNotifier.value;
        curValue += this.calculateBAC(drink.alcohol);
        PermilleCalculationService.perMilleNotifier.next(curValue);
    }

    private calculateBAC(drink: Alcohol): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        return (0.8 * a) / (1.055 * (<User>this.data.get('user')).gkw);
    }
}
