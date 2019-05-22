import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Drink} from '../../interfaces/drink';
import * as moment from 'moment';
import {ToastController} from '@ionic/angular';

declare var H: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

    @ViewChild('map')
    public mapElement: ElementRef;

    private platform: any;

    private map: any;
    private ui: any;
    private bubbles = [];

    private readonly defaultLocation = [16.22, 48.12];
    private gpsEnabled = false;

    constructor(private httpService: HttpService,
                private toastController: ToastController) {
        this.platform = new H.service.Platform({
            'app_id': 'eCKtfpvWUNdCfoHaG80Y',
            'app_code': 'O2bbtXOLoawp3qbewzXChQ'
        });
    }

    ngAfterViewInit(): void {
        this.displayMap();
    }

    displayMap() {
        const position = this.getLocation();
        const defaultLayers = this.platform.createDefaultLayers();
        this.map = new H.Map(this.mapElement.nativeElement, defaultLayers.normal.map,
            {
                zoom: 12,
                center: {
                    lng: position[0],
                    lat: position[1]
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

    onLocate() {
        const position = this.getLocation();
        this.map.setCenter({
            lng: position[0],
            lat: position[1]
        });
        this.map.setZoom(14);
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
                const date = moment(new Date(+drink.timeWhenDrank));
                const content =
                    '<b>' + drink.name + '</b>\n' +
                    '<span style="font-size: 0.8em">' + drink.amount + 'ml ' + date.format('DD.MM.YY hh:mm') + '</span>';
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

    private getLocation(): number[] {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Longitude: ' + position.coords.longitude + '\n' +
                    'Latitude: ' + position.coords.latitude + '\n');
                this.gpsEnabled = true;
                return [position.coords.longitude, position.coords.latitude];
            },
            (error) => {
                console.error('code: ' + error.code + '\nmessage: ' + error.message + '\n');
                this.gpsEnabled = false;
                this.presentToast('Note: You have allow location tracking to use all features.');
            }
        );
        // default location
        return this.defaultLocation;
    }

    private async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            showCloseButton: true
        });
        toast.present();
    }

}
