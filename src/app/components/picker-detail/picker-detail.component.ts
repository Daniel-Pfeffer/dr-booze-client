import {Component} from '@angular/core';
import {Drink} from '../../data/entities/drink';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';
import {Alcohol} from '../../data/entities/alcohol';
import {PermilleCalculationService} from '../../services/permille-calculation.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {AlcoholType} from '../../data/enums/AlcoholType';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-picker-detail',
    templateUrl: './picker-detail.component.html',
    styleUrls: ['./picker-detail.component.scss']
})
export class PickerDetailComponent {

    type: AlcoholType;
    typeStr: string;

    categories = new Map<string, Array<Alcohol>>();
    favouriteAlcohols = new Array<Alcohol>();
    useTracking = true;

    isAddingDrink = false;
    isToggleLoading = false;
    isLoadingAlcohols = false;

    constructor(private http: HttpService,
                private router: Router,
                private toastController: ToastController,
                private data: DataService,
                private geolocation: Geolocation,
                private permille: PermilleCalculationService,
                private alert: AlertController,
                private storage: Storage,
                route: ActivatedRoute) {
        this.type = +route.snapshot.paramMap.get('type');
        this.typeStr = AlcoholType[this.type];

        // load the 'activate drink tracking' user setting
        this.isToggleLoading = true;
        this.storage.get('use-drink-tracking').then((val) => {
            if (val !== null) {
                this.useTracking = val;
            }
            this.isToggleLoading = false;
        });
    }

    ionViewDidEnter() {
        this.isLoadingAlcohols = true;
        this.loadAllAlcohols();
    }

    onSelection(alcohol: Alcohol) {
        this.isAddingDrink = true;

        const drink = new Drink();
        drink.alcohol = alcohol;
        drink.drankDate = Date.now();

        // add location if drink tracking is activated
        if (this.useTracking) {
            this.geolocation.getCurrentPosition({timeout: 4000}).then(pos => {
                drink.longitude = pos.coords.longitude;
                drink.latitude = pos.coords.latitude;
                this.addDrink(drink);
            }, error => {
                let message;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Please permit location services';
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

    addFavourite(alcohol: Alcohol, slider: any) {
        const foundAlcohol = this.favouriteAlcohols.find(value => value.id === alcohol.id);
        if (foundAlcohol === undefined) {
            this.http.addFavourite(alcohol.id).subscribe(_ => {
                this.loadAllAlcohols();
                this.presentToast('Added alcohol to favourites');
            });
        } else {
            this.presentToast('Alcohol is already a favourite');
        }
        slider.close();
    }

    removeFavourite(alcoholId: number) {
        this.http.removeFavourite(alcoholId).subscribe(_ => {
            this.loadAllAlcohols();
            this.presentToast('Removed alcohol from favourites');
        });
    }

    removePersonalAlcohol(alcoholId: number) {
        this.http.removePersonalAlcohol(alcoholId).subscribe(_ => {
            this.loadAllAlcohols();
            this.presentToast('Personal drink has been removed');
        });
    }

    onTrackingToggleChange() {
        this.storage.set('use-drink-tracking', this.useTracking);
    }

    async presentNewDrinkAlert() {
        const alert = await this.alert.create({
            header: 'New drink',
            inputs: [
                {
                    type: 'text',
                    id: 'name',
                    placeholder: 'Name',
                },
                {
                    type: 'text',
                    id: 'category',
                    placeholder: 'Category (optional)',
                },
                {
                    type: 'number',
                    id: 'percentage',
                    placeholder: 'Percentage (%)',
                    min: 0,
                    max: 100,
                },
                {
                    type: 'number',
                    id: 'amount',
                    placeholder: 'Amount (ml)',
                    min: 0,
                    max: 2000,
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Add',
                    handler: (values) => this.addPersonalAlcohol(values)
                },
            ],
        });
        await alert.present();
    }

    async presentHelpAlert() {
        const alert = await this.alert.create({
            header: 'Drink tracking',
            message: 'Save the location to later see on the map where you drank beverages.',
            buttons: ['Very nice']
        });
        await alert.present();
    }

    private loadAllAlcohols() {
        this.http.getAlcohols(this.typeStr).subscribe(alcohols => {
            // clear the alcohol list and add the new alcohols
            this.categories.clear();
            alcohols.forEach(alcohol => this.addToCategories(alcohol));

            this.http.getFavourites(this.typeStr).subscribe(favourites => {
                this.http.getPersonalAlcohols(this.typeStr).subscribe(personalAlcohols => {
                    personalAlcohols.forEach(personalAlcohol => {
                        personalAlcohol.isPersonal = true;
                        this.addToCategories(personalAlcohol);
                        favourites.forEach(favourite => {
                            if (favourite.id === personalAlcohol.id) {
                                favourite.isPersonal = true;
                            }
                        });
                    });
                    this.favouriteAlcohols = favourites;
                    this.isLoadingAlcohols = false;
                });
            });
        });
    }

    private addDrink(drink: Drink) {
        this.http.addDrink(drink).subscribe(_ => {
            this.permille.addDrink(drink);
            this.isAddingDrink = false;
            this.router.navigate(['dashboard']);
        });
    }

    private addPersonalAlcohol(values) {
        const name = values[0];
        const percentage = values[2];
        const amount = values[3];

        let category = values[1];
        if (category === '' || category.toLowerCase() === 'regular') {
            category = null;
        }

        if (name !== '' && percentage >= 0 && percentage <= 100 && amount >= 1 && amount <= 2000) {
            this.http.addPersonalAlcohol(this.typeStr, name, category, percentage, amount).subscribe(alcohol => {
                alcohol.isPersonal = true;
                this.addToCategories(alcohol);
            });
            return true;
        }
        this.presentToast('At least one of the inputs is not valid');
        return false;
    }

    private addToCategories(alcohol: Alcohol) {
        if (alcohol.category === undefined || alcohol.category === null) {
            alcohol.category = 'Regular';
        }
        if (this.categories.has(alcohol.category)) {
            this.categories.get(alcohol.category).push(alcohol);
        } else {
            this.categories.set(alcohol.category, new Array<Alcohol>(alcohol));
        }
    }

    private async presentLocationErrorAlert(message: string, drink: Drink) {
        const alert = await this.alert.create({
            header: 'Cannot get location',
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => this.isAddingDrink = false
                },
                {
                    text: 'Add anyway',
                    handler: () => this.addDrink(drink)
                }
            ]
        });
        await alert.present();
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
