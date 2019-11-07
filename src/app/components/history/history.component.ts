import {Component, OnInit} from '@angular/core';
import {Drink} from '../../data/entities/drink';
import {HttpService} from '../../services/http.service';
import {AlertController, ToastController} from '@ionic/angular';
import {PermilleCalculationService} from '../../services/permille-calculation.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    drinks = Array<Drink>();

    constructor(private http: HttpService, private alert: AlertController,
                private pcs: PermilleCalculationService, private toastController: ToastController) {
    }

    ngOnInit() {
        this.http.getDrinks().subscribe((drinks: Array<Drink>) => {
            // sort the drinks by drank date
            drinks.sort((a, b) => {
                if (a.drankDate < b.drankDate) {
                    return 1;
                } else if (a.drankDate > b.drankDate) {
                    return -1;
                }
                return 0;
            });
            this.drinks = drinks;
        });
    }

    canRemove(drankDate: number): boolean {
        return Date.now() - drankDate < 300000;
    }

    removeDrink(drink: Drink, index: number) {
        this.http.removeDrink(drink.id).subscribe(_ => {
        }, (error: HttpErrorResponse) => {
            switch (error.status) {
                case 401:
                    // TODO: auth token invalid -> logout
                    break;
                case 404:
                    this.presentToast('No drink has been found with the given drinkId.');
                    break;
                default:
                    this.presentToast('An unexpected error occurred.');
                    console.error(error);
                    break;
            }
        });
        this.drinks.splice(index, 1);
        this.pcs.removeDrink(drink);
        this.presentToast('Removed drink from history.');
    }

    async presentInfoAlert() {
        const alert = await this.alert.create({
            header: 'Drink removing',
            message: 'Slide an entry to the right to remove the drink.<br>A drink cannot be removed if it is older than 5 minutes.',
            buttons: ['Understood']
        });
        await alert.present();
    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            showCloseButton: true
        });
        await toast.present();
    }
}
