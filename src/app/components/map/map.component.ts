import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Drink} from '../../data/entities/drink';
import * as moment from 'moment';
import {ToastController} from '@ionic/angular';

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
                private toastController: ToastController) {
        this.platform = new H.service.Platform({
            'app_id': 'eCKtfpvWUNdCfoHaG80Y',
            'app_code': 'O2bbtXOLoawp3qbewzXChQ'
        });
    }

    ngOnInit(): void {
        this.setLocation(true);
    }

    onLocate() {
        this.setLocation(false);
    }

    onRefresh() {
        this.displayDrinks();
    }

    private displayDrinks() {
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
                    '<span style="font-size: 0.8em">' + drink.alcohol.amount + 'ml ' + date.format('DD.MM.YY hh:mm') + '</span>';
                const bubble = new H.ui.InfoBubble(
                    {
                        lng: drink.longitude,
                        lat: drink.latitude
                    },
                    {
                        content: content,
                    });
                this.bubbles.push(bubble);
                this.ui.addBubble(bubble);
            }
        });
    }

    private setLocation(isInit: boolean) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lng = position.coords.longitude;
                const lat = position.coords.latitude;
                console.log('Longitude: ' + lng + '\n' +
                    'Latitude: ' + lat + '\n');
                if (!isInit) {
                    this.map.setCenter({
                        lng: lng,
                        lat: lat
                    });
                    this.map.setZoom(14);
                } else {
                    this.displayMap(lng, lat);
                }
            },
            (error) => {
                console.error('code: ' + error.code + '\nmessage: ' + error.message + '\n');
                this.presentToast('Note: You have allow location tracking to use all features.');
                if (isInit) {
                    this.displayMap(16.22, 48.12);
                }
            }
        );
    }

    private displayMap(lng, lat) {
        const defaultLayers = this.platform.createDefaultLayers();
        this.map = new H.Map(this.mapElement.nativeElement, defaultLayers.normal.map,
            {
                zoom: 12,
                center: {
                    lng: lng,
                    lat: lat
                }
            }
        );
        this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
        const zoom = this.ui.getControl('zoom');
        const scalebar = this.ui.getControl('scalebar');
        zoom.setAlignment('right-middle');
        scalebar.setAlignment('top-right');

        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
        this.displayDrinks();
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
