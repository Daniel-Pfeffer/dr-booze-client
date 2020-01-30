import {Component} from '@angular/core';
import {PermilleCalculationService} from '../../services/permille-calculation.service';

@Component({
    selector: 'app-header',
    templateUrl: './display-permille.component.html',
    styleUrls: ['./display-permille.component.scss']
})
export class DisplayPermilleComponent {

    currentPerMille: number;
    timeSober: Date;
    dateSober: Date;

    constructor(pcs: PermilleCalculationService) {
        pcs.perMilleObservable.subscribe(item => {
            this.currentPerMille = Math.floor(item * 100) / 100;
            this.timeSober = this.timeConverter((item / 0.1) * 60);
        });
    }

    private timeConverter(minutes: number) {
        this.dateSober = new Date(new Date().getTime() + minutes * 60000);
        // corrector because start time of unix is 1970 1 o' clock
        minutes -= 60;
        return new Date(minutes * 60 * 1000);
    }
}
