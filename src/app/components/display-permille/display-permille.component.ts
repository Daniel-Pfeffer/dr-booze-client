import {Component} from '@angular/core';
import {PermilleCalculationService} from '../../services/permille-calculation.service';
import {StorageService} from '../../services/storage.service';
import {DataService} from '../../services/data.service';
import {strings} from '@angular-devkit/core';

@Component({
    selector: 'app-header',
    templateUrl: './display-permille.component.html',
    styleUrls: ['./display-permille.component.scss']
})
export class DisplayPermilleComponent {

    currentPerMille: number;

    constructor(pcs: PermilleCalculationService, private ss: StorageService, private d: DataService) {
        pcs.perMilleObservable.subscribe(item => {
            this.currentPerMille = Math.floor(item * 100) / 100;
        });
    }

    // MARK: REMOVE
    public log() {
        this.d.getAllKeys();
    }
}
