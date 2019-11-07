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
    title: string;
    categories = new Map<string, Array<Alcohol>>();
    favouriteAlcohols = new Array<Alcohol>();
    useTracking = true;
    isLoading = false;

    constructor(private http: HttpService, private router: Router,
                private toastController: ToastController, private data: DataService,
                private geolocation: Geolocation, private permille: PermilleCalculationService,
                private alert: AlertController, route: ActivatedRoute) {
        this.type = +route.snapshot.paramMap.get('type');
        this.title = AlcoholType[this.type].toLowerCase();
    }

    ngOnInit(): void {
        const type = AlcoholType[this.type];
        this.http.getFavourites(type).subscribe(favourites => {
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
        this.http.getAlcohols(type).subscribe(alcohols => {
            alcohols.forEach(alcohol => {
                if (alcohol.category === undefined) {
                    alcohol.category = 'Regular';
                }
                if (this.categories.has(alcohol.category)) {
                    this.categories.get(alcohol.category).push(alcohol);
                } else {
                    this.categories.set(alcohol.category, new Array<Alcohol>(alcohol));
                }
            });
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

    addDrink(drink: Drink) {
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
                        this.presentToast('An unexpected error occurred.');
                        console.error(error);
                        break;
                }
            });
    }

    addFavourite(alcohol: Alcohol, slider: any) {
        const foundAlcohol = this.favouriteAlcohols.find(value => value.id === alcohol.id);
        if (foundAlcohol === undefined) {
            this.http.addFavourite(alcohol.id).subscribe(_ => {
                    this.favouriteAlcohols.push(alcohol);
                    this.presentToast('Added alcohol to favourites.');
                },
                (error: HttpErrorResponse) => {
                    this.isLoading = false;
                    switch (error.status) {
                        case 401:
                            // TODO: auth token invalid -> logout
                            break;
                        case 404:
                            this.presentToast('No alcohol has been found with the given alcoholId');
                            break;
                        default:
                            this.presentToast('An unexpected error occurred.');
                            console.error(error);
                            break;
                    }
                });
        } else {
            this.presentToast('Alcohol is already a favourite.');
        }
        slider.close();
    }

    removeFavourite(alcohol: Alcohol, index: number) {
        this.http.removeFavourite(alcohol.id).subscribe(_ => {
                this.favouriteAlcohols.splice(index, 1);
                this.presentToast('Removed alcohol from favourites.');
            },
            (error: HttpErrorResponse) => {
                this.isLoading = false;
                switch (error.status) {
                    case 401:
                        // TODO: auth token invalid -> logout
                        break;
                    case 404:
                        this.presentToast('No alcohol has been found with the given alcoholId.');
                        break;
                    default:
                        this.presentToast('An unexpected error occurred.');
                        console.error(error);
                        break;
                }
            });
    }

    async presentHelpAlert() {
        const alert = await this.alert.create({
            header: 'Drink tracking',
            message: 'Save the location to later see on the map where you drank beverages.',
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
