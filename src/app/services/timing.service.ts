import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TimingService {

    private subject: Subject<boolean>;
    public observable: Observable<boolean>;

    constructor() {
        this.subject = new Subject<boolean>();
        this.observable = this.subject.asObservable();
    }

    /* TODO: change from 5.000 timout to 60.000
              Performance increase by stopping the timeout and continuing it when the user adds a drink (!Maybe!)
                Discuss
     */
    public start(): void {
        setTimeout(() => {
            this.subject.next(true);
            this.start();
        }, 100);
    }
}
