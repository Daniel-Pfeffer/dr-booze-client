import {Component, Input} from '@angular/core';
import {Drink} from '../../../data/entities/drink';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-modal-drink-list',
    templateUrl: './modal-drink-list.component.html',
    styleUrls: ['./modal-drink-list.component.scss']
})
export class ModalDrinkListComponent {
    @Input() drinks: Drink[];

    constructor(private modalController: ModalController) {
    }

    dismiss() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }
}
