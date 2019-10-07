import {Component} from '@angular/core';
import {PermilleCalculationService} from '../../services/permille-calculation.service';

@Component({
    selector: 'app-header',
    templateUrl: './display-permille.component.html',
    styleUrls: ['./display-permille.component.scss']
})
export class DisplayPermilleComponent {

    currentPerMille: number;

    constructor(data: PermilleCalculationService) {
        data.perMilleObservable.subscribe(item => this.currentPerMille = item);
    }
}
