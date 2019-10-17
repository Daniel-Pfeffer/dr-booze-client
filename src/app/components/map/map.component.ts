import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {HttpService} from '../../services/http.service';
import {Drink} from '../../data/entities/drink';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AlcoholType} from '../../data/enums/AlcoholType';

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
    private icons = new Map();

    constructor(private httpService: HttpService,
                private geolocation: Geolocation,
                private toastController: ToastController,
                private router: Router) {
        this.platform = new H.service.Platform({
            'app_id': 'eCKtfpvWUNdCfoHaG80Y',
            'app_code': 'O2bbtXOLoawp3qbewzXChQ'
        });
        const config = {
            size: {w: 35, h: 35}
        };
        this.icons.set(AlcoholType.BEER, new H.map.Icon('../../../assets/beer.svg', config));
        this.icons.set(AlcoholType.WINE, new H.map.Icon('../../../assets/wine.svg', config));
        this.icons.set(AlcoholType.COCKTAIL, new H.map.Icon('../../../assets/cocktail.svg', config));
        this.icons.set(AlcoholType.LIQUOR, new H.map.Icon('../../../assets/whiskey.svg', config));
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
        this.displayDrinks();
    }

    setLocation() {
        this.geolocation.getCurrentPosition({timeout: 2000}).then(pos => {
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
        });
    }

    displayDrinks() {
        // add drinks to map
        this.httpService.getDrinks().subscribe((drinks: Array<Drink>) => {
            // group the drinks that are within a 22m radius
            const drinkGroups = Array<Array<Drink>>();
            drinks.forEach((value1, index1, array1) => {
                const group = [value1];
                const point1 = new H.math.Point(value1.longitude, value1.latitude);
                array1.forEach((value2, index2, array2) => {
                    if (value1 !== value2) {
                        const point2 = new H.math.Point(value2.longitude, value2.latitude);
                        const distance = point1.distance(point2);
                        if (distance <= 0.0002) {
                            group.push(value2);
                            array2.splice(index2, 1);
                        }
                    }
                });
                drinkGroups.push(group);
            });
            // display the drink groups on the map
            drinkGroups.forEach(value => {
                const drink: Drink = value[0];
                const icon = this.icons.get(AlcoholType[drink.alcohol.type]);
                this.map.addObject(new H.map.Marker(
                    {lng: drink.longitude, lat: drink.latitude},
                    {icon: icon}
                ));
            });
        });
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
