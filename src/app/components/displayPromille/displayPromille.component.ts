import {Component} from '@angular/core';
import {Drink} from '../../interfaces/drink';
import {Person} from '../../entities/person';
import * as moment from 'moment';
import {Moment} from 'moment';
import {PerMilleCalculationService} from '../../services/per-mille-calculation.service';

@Component({
    selector: 'app-header',
    templateUrl: './displayPromille.component.html',
    styleUrls: ['./displayPromille.component.scss']
})
export class DisplayPromilleComponent {

    currentPerMille: number;

    constructor(data: PerMilleCalculationService) {
        data.perMilleObservable.subscribe(item => this.currentPerMille = item);
    }
}
