import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Drink} from '../data/entities/drink';
import {DataService} from './data.service';
import {User} from '../data/entities/user';
import {Alcohol} from '../data/entities/alcohol';
import {TimingService} from './timing.service';
import {StorageType} from '../data/enums/StorageType';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';

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

    constructor(private data: DataService,
                private timing: TimingService,
                private background: BackgroundMode,
                private notifications: LocalNotifications,
                private platform: Platform,
                private storage: Storage
    ) {
        this.perMilleNotifier = new BehaviorSubject<number>(0);
        this.statisticNotifier = new BehaviorSubject<number>(0);
        this.perMilleObservable = this.perMilleNotifier.asObservable();
        this.statisticObservable = this.statisticNotifier.asObservable();
        this.resetHour();
        timing.start();
        if (this.perMilleNotifier.value === 0) {
            storage.get('promille').then(permille => {
                if (permille !== 0) {
                    storage.get('promilleTime').then(time => {
                        if (time) {
                            // @ts-ignore
                            const timeSince = (new Date() - Date.parse(time));
                            console.log('hours: time ' + time);
                            console.log('hours: typeoftime ' + typeof time);
                            console.log('hours: timesince ' + timeSince);
                            const hours = timeSince / 1000 / 60 / 60;
                            console.log('hours: ' + hours);
                            this.perMilleNotifier.next((permille - (hours * 0.1)));
                        } else {
                            this.perMilleNotifier.next(0);
                        }

                    });
                }
            });
        }
        this.timing.observable.subscribe(() => {
            if (this.perMilleNotifier.value > this.hourlyMax) {
                this.hourlyMax = this.perMilleNotifier.value;
            }
            let curValue: number = this.perMilleNotifier.value;
            if (curValue > (0.1) / 60) {
                curValue -= (0.1 / 60);
            } else {
                curValue = 0;
                this.timing.stop();
                if (this.background.isActive()) {
                    this.notifications.hasPermission().then(value => {
                        if (value) {
                            this.notifications.schedule({
                                title: 'You are sober!',
                                text: 'Your blood alcohol level has reached 0‰',
                                foreground: true
                            });
                        }
                    });
                }
            }
            this.minuteCounter++;
            if (this.minuteCounter === 1) {
                console.log('60 iterations passed');
                this.statisticNotifier.next(this.hourlyMax);
                this.resetHour();
            }
            this.perMilleNotifier.next(curValue);
            this.setToStorage();
        });
        this.background.enable();
        this.platform.pause.subscribe(_ => {
            console.log('exit: Hi');
            this.setToStorage();
        });
    }

    private setToStorage(): void {
        this.storage.set('promille', this.perMilleNotifier.value).then(value => {
            console.log('exit: set promille: ' + value);
        }).catch(reason => {
            console.log('exit: error: ' + reason);
        });
        this.storage.set('promilleTime', new Date()).then(value => {
            console.log('exit: set promilletime: ' + value);
        }).catch(reason => {
            console.log('exit: error: ' + reason);
        });
    }

    public addDrink(drink: Drink) {
        let curValue: number = this.perMilleNotifier.value;
        curValue += this.calculateBAC(drink.alcohol);
        this.perMilleNotifier.next(curValue);
        this.setToStorage();
        if (!this.timing.isRunning) {
            this.timing.start();
        }
    }

    public removeDrink(drink: Drink) {
        let curValue: number = this.perMilleNotifier.value;
        curValue -= this.calculateBAC(drink.alcohol);
        if (curValue < 0) {
            curValue = 0;
        }
        this.perMilleNotifier.next(curValue);
    }

    private resetHour() {
        this.minuteCounter = 0;
        this.hourlyMax = 0;
    }

    private calculateBAC(drink: Alcohol): number {
        const a = (drink.amount * (drink.percentage / 100)) * 0.8;
        return (0.8 * a) / (1.055 * (<User>this.data.get(StorageType.PERSON)).gkw);
    }
}
