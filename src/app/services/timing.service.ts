import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TimingService {

    private subject: Subject<boolean>;
    public observable: Observable<boolean>;
    public isRunning: boolean;

    constructor() {
        this.subject = new Subject<boolean>();
        this.observable = this.subject.asObservable();
        this.isRunning = false;
    }

    public start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
        }
        setTimeout(() => {
            this.subject.next(true);
            if (this.isRunning) {
                this.start();
            }
        }, 60000);
    }

    public stop(): void {
        this.isRunning = false;
    }
}
