import {Component, Input, OnInit} from '@angular/core';
import {Drink} from '../../../data/entities/drink';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-modal-drink-list',
    templateUrl: './modal-drink-list.component.html',
    styleUrls: ['./modal-drink-list.component.scss']
})
export class ModalDrinkListComponent implements OnInit {

    @Input() drinks: Drink[];

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            'dismissed': true
        });
    }
}
