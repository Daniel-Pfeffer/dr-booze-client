import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {HttpService} from '../../services/http.service';
import {Drink} from '../../data/entities/drink';
import * as moment from 'moment';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

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
    private bubbles = [];

    constructor(private httpService: HttpService,
                private geolocation: Geolocation,
                private toastController: ToastController,
                private router: Router) {
        this.platform = new H.service.Platform({
            'app_id': 'eCKtfpvWUNdCfoHaG80Y',
            'app_code': 'O2bbtXOLoawp3qbewzXChQ'
        });
    }

    ngOnInit(): void {
        const defaultLayers = this.platform.createDefaultLayers();
        const lng = 14.252778;
        const lat = 48.279167;
        const config = {
            zoom: 12,
            center: {
                lng: lng,
                lat: lat
            }
        };
        this.map = new H.Map(this.mapElement.nativeElement, defaultLayers.normal.map, config);
        this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
        this.ui.getControl('zoom').setAlignment('right-middle');
        this.ui.getControl('scalebar').setAlignment('top-right');
        this.ui.removeControl('mapsettings');
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
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
        // remove old bubbles
        for (const bubble of this.bubbles) {
            this.ui.removeBubble(bubble);
        }
        // add drinks to map
        this.httpService.getDrinks().subscribe((drinks: Array<Drink>) => {
            for (const drink of drinks) {
                const date = moment(drink.drankDate);
                const content =
                    '<b>' + drink.alcohol.name + '</b>\n' +
                    '<span style="font-size: 0.8em">' + drink.alcohol.amount + 'ml '
                    + date.format('DD.MM.YY hh:mm') + '</span>';
                /*const content =
                    `<b>${drink.alcohol.name}</b>\n` +
                    `<span style="font-size: 0.8em">${drink.alcohol.amount}ml` +
                    `${date.format('DD.MM.YY hh:mm')}</span>`;*/
                const bubble = new H.ui.InfoBubble({lng: drink.longitude, lat: drink.latitude}, {content: content});
                this.bubbles.push(bubble);
                this.ui.addBubble(bubble);
            }
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
