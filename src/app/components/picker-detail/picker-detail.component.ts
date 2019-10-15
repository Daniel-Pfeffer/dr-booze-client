import {Component} from '@angular/core';
import {Drink} from '../../data/entities/drink';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';
import {Alcohol} from '../../data/entities/alcohol';
import {HttpErrorResponse} from '@angular/common/http';
import {PermilleCalculationService} from '../../services/permille-calculation.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {StorageType} from '../../data/enums/StorageType';
import {AlcoholType} from '../../data/enums/AlcoholType';

/**
 * TODO: Add loading animation, save personal useTracking default
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

    alcohols = new Array<Alcohol>();
    useTracking = true;

    isLoading = false;

    constructor(private http: HttpService, private router: Router,
                private toastController: ToastController, private data: DataService, private geolocation: Geolocation,
                private permille: PermilleCalculationService, private alert: AlertController, route: ActivatedRoute) {
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
        this.isLoading = true;
        const drink = new Drink();
        drink.alcohol = alcohol;
        drink.drankDate = Date.now();
        // add location if drink tracking is activated
        if (this.useTracking) {
            this.geolocation.getCurrentPosition({timeout: 2000}).then(pos => {
                drink.longitude = pos.coords.longitude;
                drink.latitude = pos.coords.latitude;
                this.addDrink(drink);
            }, error => {
                let message;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Please permit location services.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Position unavailable. Please check if your location service is turned on.';
                        break;
                    case error.TIMEOUT:
                        message = 'Timeout. Please check if your location service is turned on.';
                        break;
                }
                this.presentLocationErrorAlert(message, drink);
            });
        } else {
            this.addDrink(drink);
        }
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
                this.isLoading = false;
            }, (error: HttpErrorResponse) => {
                this.isLoading = false;
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

    async presentHelpAlert() {
        const alert = await this.alert.create({
            header: 'Drink tracking',
            message: 'Save the drink location to later track on the map where you drank.',
            buttons: ['Very nice']
        });
        await alert.present();
    }

    async presentLocationErrorAlert(message: string, drink: Drink) {
        const alert = await this.alert.create({
            header: 'Cannot get location',
            message: message,
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => this.isLoading = false
            }, {
                text: 'Add anyway',
                handler: () => this.addDrink(drink)
            }]
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
