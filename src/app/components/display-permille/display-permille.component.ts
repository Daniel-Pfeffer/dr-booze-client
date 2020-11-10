import {Component} from '@angular/core';
import {PermilleCalculationService} from '../../services/permille-calculation.service';

@Component({
    selector: 'app-header',
    templateUrl: './display-permille.component.html',
    styleUrls: ['./display-permille.component.scss']
})
export class DisplayPermilleComponent {

    currentPerMille: number;
    timeSober: number;
    soberH: number;
    soberMin: number;

    constructor(pcs: PermilleCalculationService) {
        pcs.perMilleObservable.subscribe(item => {
            this.currentPerMille = Math.floor(item * 100) / 100;
            this.timeSober = (item / 0.1) * 60;
            this.soberH = Math.floor(item / 0.1);
            this.soberMin = Math.floor(((item / 0.1) * 60) % 60);
            console.log('sober: ' + this.timeSober);
        });
    }

    private timeConverter(minutes: number) {
        // corrector because start time of unix is 1970 1 o' clock
        console.log('minutes: ' + minutes);
        return new Date(new Date(minutes * 60 * 1000).getUTCDate() + ' GMT+0');
    }
}
