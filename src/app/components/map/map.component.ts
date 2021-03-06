import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {HttpService} from '../../services/http.service';
import {Drink} from '../../data/entities/drink';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AlcoholType} from '../../data/enums/AlcoholType';
import * as moment from 'moment';
import {ModalDrinkListComponent} from './modal-drink-list/modal-drink-list.component';

declare var H: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    @ViewChild('map')
    public mapElement: ElementRef;
    private platform: any;
    private map: any;
    private ui: any;
    private icons = new Map<number, any>();

    isLoadingLocation = false;
    isLoadingDrinks = false;

    constructor(private http: HttpService,
                private geolocation: Geolocation,
                private toastController: ToastController,
                private router: Router,
                private alert: AlertController,
                private modalController: ModalController) {
        this.platform = new H.service.Platform({
            'app_id': 'eCKtfpvWUNdCfoHaG80Y',
            'app_code': 'O2bbtXOLoawp3qbewzXChQ'
        });
        const config = {
            size: {w: 50, h: 50}
        };
        // specific alcohol icons
        this.icons.set(AlcoholType.BEER, new H.map.Icon('../../../assets/map/beer.svg', config));
        this.icons.set(AlcoholType.WINE, new H.map.Icon('../../../assets/map/wine.svg', config));
        this.icons.set(AlcoholType.COCKTAIL, new H.map.Icon('../../../assets/map/cocktail.svg', config));
        this.icons.set(AlcoholType.LIQUOR, new H.map.Icon('../../../assets/map/whiskey.svg', config));
        // group icon
        this.icons.set(4, new H.map.Icon('../../../assets/map/group.svg', config));
    }

    ngOnInit(): void {
        // map setup
        const defaultLayers = this.platform.createDefaultLayers();
        const lng = 14.252778;
        const lat = 48.279167;
        const config = {
            zoom: 12,
            center: {lng: lng, lat: lat}
        };
        this.map = new H.Map(this.mapElement.nativeElement, defaultLayers.normal.map, config);
        this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
        this.ui.getControl('zoom').setAlignment('right-middle');
        this.ui.getControl('scalebar').setAlignment('top-right');
        this.ui.removeControl('mapsettings');
        // tslint:disable-next-line:no-unused-expression
        new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
        this.setLocation();
    }

    ionViewDidEnter() {
        this.displayDrinks();
    }

    setLocation() {
        this.isLoadingLocation = true;
        this.geolocation.getCurrentPosition({timeout: 4000}).then(pos => {
            const lng = pos.coords.longitude;
            const lat = pos.coords.latitude;
            this.map.setCenter({lng: lng, lat: lat});
            this.map.setZoom(14);
        }, error => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    this.presentToast('Please permit location services.');
                    this.router.navigate(['/home']);
                    break;
                case error.POSITION_UNAVAILABLE:
                    this.presentToast('Position unavailable. Please check if your location service is turned on.');
                    break;
                case error.TIMEOUT:
                    this.presentToast('Timeout. Please check if your location service is turned on.');
                    break;
            }
        }).finally(() => this.isLoadingLocation = false);
    }

    displayDrinks() {
        this.isLoadingDrinks = true;
        // remove previous markers
        const mapObjects: any[] = this.map.getObjects();
        for (const obj of mapObjects) {
            if (obj instanceof H.map.Marker) {
                this.map.removeObject(obj);
            }
        }
        // add drinks to map
        this.http.getDrinks(0).subscribe((drinks1: Array<Drink>) => {
            if (drinks1.length >= 15) {
                this.http.getDrinks(1).subscribe((drinks2: Array<Drink>) => {
                    drinks1.push(...drinks2);
                    this.processDrinks(drinks1);
                });
            } else {
                this.processDrinks(drinks1);
            }
        });
    }

    private processDrinks(drinks: Array<Drink>) {
        // remove the drinks that have no location
        drinks = drinks.filter(drink => drink.longitude !== undefined && drink.latitude !== undefined);
        // here be dragons
        // group the drinks that are within a 22m radius
        const drinkGroups = Array<Array<Drink>>();
        drinks.forEach((value1, index1, array1) => {
            if (value1 != null) {
                const group = [value1];
                const point1 = new H.math.Point(value1.longitude, value1.latitude);
                array1.forEach((value2, index2, array2) => {
                    if (value1 !== value2 && value2 != null) {
                        const point2 = new H.math.Point(value2.longitude, value2.latitude);
                        const distance = point1.distance(point2);
                        if (distance <= 0.0002) {
                            group.push(value2);
                            array2[index2] = null;
                        }
                    }
                });
                array1[index1] = null;
                drinkGroups.push(group);
            }
        });
        // display the drink groups on the map
        drinkGroups.forEach(value => {
            const drink: Drink = value[0];
            // get the group icon or the alcohol specific alcohol icon
            const icon = this.icons.get(value.length > 1 ? 4 : +AlcoholType[drink.alcohol.type]);
            const marker = new H.map.Marker(
                {lng: drink.longitude, lat: drink.latitude},
                {icon: icon, data: value}
            );
            marker.addEventListener('tap', (ev) => this.presentDrinkAlert(ev.target.getData()));
            this.map.addObject(marker);
        });
        this.isLoadingDrinks = false;
    }

    async presentDrinkAlert(drinks: Drink[]) {
        // sort the drinks by drank date
        drinks.sort((a, b) => {
            if (a.drankDate < b.drankDate) {
                return 1;
            } else if (a.drankDate > b.drankDate) {
                return -1;
            }
            return 0;
        });
        // display a maximum of 3 drinks in the alert
        const length = drinks.length < 3 ? drinks.length : 3;
        let message = '';
        for (let i = 0; i < length; ++i) {
            const drink = drinks[i];
            message += `<b>${drink.alcohol.name}</b> ${moment(drink.drankDate).format('DD.MM.YY HH:mm')}<br>`;
        }
        // show the 'show all'-button when some drinks cannot be shown on the alert
        const remaining = drinks.length - length;
        if (remaining > 0) {
            message += `(${remaining} earlier drinks)`;
        }
        const alert = await this.alert.create({
            header: 'Drinks',
            message: message,
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel'
                },
                {
                    text: 'Details',
                    handler: () => this.presentModal(drinks)
                }
            ]

        });
        await alert.present();
    }

    async presentModal(drinks: Drink[]) {
        const modal = await this.modalController.create({
            component: ModalDrinkListComponent,
            componentProps: {
                'drinks': drinks
            }
        });
        return await modal.present();
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
