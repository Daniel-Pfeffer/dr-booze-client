import {Component} from '@angular/core';
import {Drink} from '../../data/entities/drink';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';
import {Alcohol, AlcoholType} from '../../data/entities/alcohol';
import {HttpErrorResponse} from '@angular/common/http';
import {PermilleCalculationService} from '../../services/permille-calculation.service';
import {StorageType} from '../../data/enums/StorageType';

/**
 * TODO: Add loading animation
 */
@Component({
    selector: 'app-picker-detail',
    templateUrl: './picker-detail.component.html',
    styleUrls: ['./picker-detail.component.scss']
})
export class PickerDetailComponent {
    type: AlcoholType;
    title: string;
    iconName: string;
    iconMode: string;
    alcohols: Array<Alcohol> = new Array<Alcohol>();

    constructor(private http: HttpService,
                private router: Router,
                private toastController: ToastController,
                private data: DataService,
                route: ActivatedRoute,
                private permille: PermilleCalculationService) {
        this.type = +route.snapshot.paramMap.get('type');
        let typeStr;
        switch (this.type) {
            case AlcoholType.BEER:
                this.title = 'Beer';
                this.iconName = 'beer';
                typeStr = 'beer';
                break;
            case AlcoholType.WINE:
                this.title = 'Wine';
                this.iconName = 'wine';
                this.iconMode = 'ios';
                typeStr = 'wine';
                break;
            case AlcoholType.COCKTAIL:
                this.title = 'Cocktails';
                this.iconName = 'wine';
                this.iconMode = 'md';
                typeStr = 'cocktail';
                break;
            case AlcoholType.LIQUOR:
                this.title = 'Hard liquor';
                this.iconName = null;
                this.iconMode = null;
                typeStr = 'liquor';
                break;
        }
        http.getAlcohols(typeStr).subscribe(alcohols => {
            this.alcohols = alcohols;
        }, (error: HttpErrorResponse) => {
            switch (error.status) {
                case 401:
                    // TODO: auth token invalid -> logout
                    break;
                case 404:
                    this.presentToast('The given alcohol type does not exist');
                    break;
                default:
                    console.error(error);
                    break;
            }
        });
    }

    onSelection(alcohol: Alcohol) {
        const drink = new Drink();
        drink.alcohol = alcohol;
        drink.drankDate = Date.now();
        // add location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                drink.longitude = position.coords.longitude;
                drink.latitude = position.coords.latitude;
                this.addDrink(drink);
            },
            (error) => {
                console.error('code: ' + error.code + '\nmessage: ' + error.message + '\n');
                this.addDrink(drink);
                this.presentToast('Note: You have to allow location tracking to use the map feature.');
            }
        );
    }

    private addDrink(drink: Drink) {
        const {Drinks} = StorageType;
        const drinks = this.data.exist(Drinks) ? this.data.get(Drinks) : new Array<Drink>();
        drinks.push(drink);
        this.data.set(Drinks, drinks);
        this.permille.addDrink(drink);
        this.http.addDrink(drink.alcohol.id, drink.drankDate, drink.longitude, drink.latitude)
            .subscribe(_ => {
                this.router.navigate(['dashboard']);
            }, (error: HttpErrorResponse) => {
                switch (error.status) {
                    case 401:
                        // TODO: auth token invalid -> logout
                        break;
                    case 404:
                        this.presentToast('No alcohol has been found with the given alcoholId');
                        break;
                    default:
                        console.error(error);
                        break;
                }
            });
    }

    private async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            showCloseButton: true
        });
        await toast.present();
    }
}
