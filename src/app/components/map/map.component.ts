import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Drink} from '../../interfaces/drink';

declare var H: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

    @ViewChild('map')
    public mapElement: ElementRef;

    private platform: any;

    private lng = 14.252778;
    private lat = 48.279167;

    constructor(private httpService: HttpService) {
        this.platform = new H.service.Platform({
            'app_id': 'eCKtfpvWUNdCfoHaG80Y',
            'app_code': 'O2bbtXOLoawp3qbewzXChQ'
        });
    }

    ngOnInit() {
        this.httpService.getDrinks().subscribe((drinks: Array<Drink>) => {
            // TODO @burgus
        });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(
                    'Latitude: ' + position.coords.latitude + '\n' +
                    'Longitude: ' + position.coords.longitude + '\n'
                );
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            },
            (error) => {
                console.error('code: ' + error.code + '\nmessage: ' + error.message + '\n');
            }
        );
    }

    ngAfterViewInit(): void {
        const defaultLayers = this.platform.createDefaultLayers();
        const map = new H.Map(
            this.mapElement.nativeElement,
            defaultLayers.normal.map,
            {zoom: 12, center: {lng: this.lng, lat: this.lat}}
        );
        const ui = H.ui.UI.createDefault(map, defaultLayers);

        const zoom = ui.getControl('zoom');
        const scalebar = ui.getControl('scalebar');
        zoom.setAlignment('top-left');
        scalebar.setAlignment('top-left');

        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        const content = '<b>Bier</b><br>';
        const bubble = new H.ui.InfoBubble({lng: 14.252778, lat: 48.279167}, {
            content: content,
        });

        // Add info bubble to the UI:
        ui.addBubble(bubble);

    }

}
