import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
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

    private perMilleNotifier: BehaviorSubject<number>;
    private statisticNotifier: Subject<number>;
    public perMilleObservable: Observable<number>;
    public statisticObservable: Observable<number>;
    private minuteCounter: number;
    private hourlyMax: number;

    constructor(private data: DataService, private timing: TimingService) {
        this.perMilleNotifier = new BehaviorSubject<number>(0);
        this.statisticNotifier = new BehaviorSubject<number>(0);
        this.perMilleObservable = this.perMilleNotifier.asObservable();
        this.statisticObservable = this.statisticNotifier.asObservable();
        this.resetHour();
        timing.start();
        this.timing.observable.subscribe(item => {
            console.log('5 seconds passed');
            if (this.perMilleNotifier.value > this.hourlyMax) {
                this.hourlyMax = this.perMilleNotifier.value;
            }
            let curValue: number = this.perMilleNotifier.value;
            if (curValue > (0.1) / 60) {
                curValue -= (0.1 / 60);
            } else {
                curValue = 0;
            }
            this.minuteCounter++;
            if (this.minuteCounter === 60) {
                console.log('60 iterations passed');
                this.statisticNotifier.next(this.hourlyMax);
                this.resetHour();
            }
            this.perMilleNotifier.next(curValue);
        });
    }

    public addDrink(drink: Drink) {
        let curValue: number = this.perMilleNotifier.value;
        curValue += this.calculateBAC(drink.alcohol);
        this.perMilleNotifier.next(curValue);
    }

    private resetHour() {
        this.minuteCounter = 0;
        this.hourlyMax = 0;
    }

    private calculateBAC(drink: Alcohol): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        return (0.8 * a) / (1.055 * (<User>this.data.get('user')).gkw);
    }
}
