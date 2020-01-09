import {Component, OnInit} from '@angular/core';
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

/*
 * TODO: save personal useTracking default
 */
@Component({
    selector: 'app-picker-detail',
    templateUrl: './picker-detail.component.html',
    styleUrls: ['./picker-detail.component.scss']
})
export class PickerDetailComponent implements OnInit {

    type: AlcoholType;
    typeStr: string;

    categories = new Map<string, Array<Alcohol>>();
    favouriteAlcohols = new Array<Alcohol>();
    useTracking = true;
    isLoading = false;

    constructor(private http: HttpService,
                private router: Router,
                private toastController: ToastController,
                private data: DataService,
                private geolocation: Geolocation,
                private permille: PermilleCalculationService,
                private alert: AlertController,
                route: ActivatedRoute) {
        this.type = +route.snapshot.paramMap.get('type');
        this.typeStr = AlcoholType[this.type];
    }

    ngOnInit(): void {
        this.loadFavourites();
        this.loadAlcohols();
        this.loadPersonalAlcohols();
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
                this.loadFavourites();
                // also reload the personal alcohols because this functions sets the isPersonal attribute of the favourites
                if (alcohol.isPersonal) {
                    this.loadPersonalAlcohols();
                }
                this.presentToast('Added alcohol to favourites');
            }, error => {
                switch (error.status) {
                    case 401:
                        // TODO: auth token invalid -> logout
                        break;
                    case 404:
                        this.presentToast('No alcohol has been found with the given alcoholId');
                        break;
                    default:
                        this.presentToast('An unexpected error occurred');
                        console.error(error);
                        break;
                }
            });
        } else {
            this.presentToast('Alcohol is already a favourite');
        }
        slider.close();
    }

    removeFavourite(alcoholId: number) {
        this.http.removeFavourite(alcoholId).subscribe(_ => {
            this.loadFavourites();
            this.presentToast('Removed alcohol from favourites');
        }, error => {
            switch (error.status) {
                case 401:
                    // TODO: auth token invalid -> logout
                    break;
                case 404:
                    this.presentToast('This alcohol does not exist anymore');
                    break;
                default:
                    this.presentToast('An unexpected error occurred');
                    console.error(error);
                    break;
            }
        });
    }

    removePersonalAlcohol(alcoholId: number) {
        this.http.removePersonalAlcohol(alcoholId).subscribe(_ => {
            this.loadFavourites();
            this.loadAlcohols();
            this.loadPersonalAlcohols();
            this.presentToast('Personal drink has been removed');
        }, error => {
            switch (error.status) {
                case 401:
                    // TODO: auth token invalid -> logout
                    break;
                case 403:
                    this.presentToast('This alcohol is not a personal alcohol of this user');
                    break;
                case 404:
                    this.presentToast('This alcohol does not exist anymore');
                    break;
                default:
                    this.presentToast('An unexpected error occurred');
                    console.error(error);
                    break;
            }
        });
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

    private loadFavourites() {
        this.http.getFavourites(this.typeStr).subscribe(favourites => {
            this.data.set(StorageType['FAVOURITE' + this.typeStr], favourites);
            this.favouriteAlcohols = favourites;
        }, (error: HttpErrorResponse) => {
            switch (error.status) {
                case 401:
                    // TODO: auth token invalid -> logout
                    break;
                case 404:
                    this.presentToast('The given alcohol type does not exist');
                    break;
                default:
                    this.presentToast('An unexpected error occurred.');
                    console.error(error);
                    break;
            }
        });
    }

    private loadAlcohols() {
        this.http.getAlcohols(this.typeStr).subscribe(alcohols => {
            if (!this.data.exist(StorageType[this.typeStr])) {
                this.data.set(StorageType[this.typeStr], alcohols);
            }
            this.categories.clear();
            alcohols.forEach(alcohol => {
                this.addToCategories(alcohol);
            });
        }, error => {
            switch (error.status) {
                case 401:
                    // TODO: auth token invalid -> logout
                    break;
                case 404:
                    this.presentToast('The given alcohol type does not exist');
                    break;
                default:
                    this.presentToast('An unexpected error occurred.');
                    console.error(error);
                    break;
            }
        });
    }

    private loadPersonalAlcohols() {
        this.http.getPersonalAlcohols(this.typeStr).subscribe(personalAlcohols => {
            personalAlcohols.forEach(personalAlcohol => {
                personalAlcohol.isPersonal = true;
                this.addToCategories(personalAlcohol);
                this.favouriteAlcohols.forEach(favourite => {
                    if (favourite.id === personalAlcohol.id) {
                        favourite.isPersonal = true;
                    }
                });
            });
        });
    }

    private addDrink(drink: Drink) {
        this.http.addDrink(drink).subscribe(_ => {
            this.permille.addDrink(drink);
            this.isLoading = false;
            this.router.navigate(['dashboard']);
        }, error => {
            this.isLoading = false;
            switch (error.status) {
                case 401:
                    // TODO: auth token invalid -> logout
                    break;
                case 404:
                    this.presentToast('No alcohol has been found with the given alcoholId');
                    break;
                default:
                    this.presentToast('An unexpected error occurred');
                    console.error(error);
                    break;
            }
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
            }, (error: HttpErrorResponse) => {
                switch (error.status) {
                    case 401:
                        // TODO: auth token invalid -> logout
                        break;
                    case 403:
                        this.presentToast('At least one of the inputs is not valid');
                        break;
                    default:
                        this.presentToast('An unexpected error occurred');
                        console.error(error);
                        break;
                }
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

    private async presentHelpAlert() {
        const alert = await this.alert.create({
            header: 'Drink tracking',
            message: 'Save the location to later see on the map where you drank beverages.',
            buttons: ['Very nice']
        });
        await alert.present();
    }

    private async presentLocationErrorAlert(message: string, drink: Drink) {
        const alert = await this.alert.create({
            header: 'Cannot get location',
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => this.isLoading = false
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
