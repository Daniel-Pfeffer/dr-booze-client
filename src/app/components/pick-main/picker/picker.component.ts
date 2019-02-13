import {Component, Input} from '@angular/core';
import {Drink} from '../../../interfaces/drink';

@Component({
    selector: 'app-picker',
    templateUrl: './picker.component.html',
    styleUrls: ['./picker.component.scss']
})
export class PickerComponent {
    @Input() drinks: Array<Drink>;
    @Input() group: string;

    constructor() {
    }


}
