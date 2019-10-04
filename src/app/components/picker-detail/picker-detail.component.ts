import {Component, OnInit} from '@angular/core';
import {Drink, DrinkType} from '../../interfaces/drink';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import {ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';

/**
 * TODO: Add loading animation
 */
@Component({
    selector: 'app-picker-detail',
    templateUrl: './picker-detail.component.html',
    styleUrls: ['./picker-detail.component.scss']
})
export class PickerDetailComponent implements OnInit {

    drinks: Array<Drink>;
    drinkType: DrinkType;
    title: string;
    iconName: string;
    iconMode: string;

    constructor(private http: HttpService,
                private route: ActivatedRoute,
                private router: Router,
                private toastController: ToastController,
                private data: DataService) {
        this.drinks = new Array<Drink>();

        this.drinkType = +this.route.snapshot.paramMap.get('type');
        switch (this.drinkType) {
            case DrinkType.BEER:
                this.title = 'Beer';
                this.iconName = 'beer';
                this.http.getBeer().subscribe((beer) => {
                    this.drinks = beer;
                }, () => {
                    this.presentToast('Server not reachable', 3000);
                });
                break;
            case DrinkType.WINE:
                this.title = 'Wine';
                this.iconName = 'wine';
                this.iconMode = 'ios';
                this.http.getWine().subscribe((wine) => {
                    this.drinks = wine;
                }, () => {
                    this.presentToast('Server not reachable', 3000);
                });
                break;
            case DrinkType.COCKTAIL:
                this.title = 'Cocktails';
                this.iconName = 'wine';
                this.iconMode = 'md';
                this.http.getCocktails().subscribe((cocktails) => {
                    this.drinks = cocktails;
                }, () => {
                    this.presentToast('Server not reachable', 3000);
                });
                break;
            case DrinkType.LIQUOR:
                this.title = 'Hard liquor';
                this.iconName = 'wine';
                this.iconMode = 'md';
                this.http.getLiquor().subscribe((liquor) => {
                    this.drinks = liquor;
                }, () => {
                    this.presentToast('Server not reachable', 3000);
                });
                break;
            /*
            case DrinkType.OTHER:
                this.title = 'Other drinks';
                break;
            */
        }
    }

    ngOnInit() {
    }

    onSelection(selectedDrink: Drink) {
        // add time when drank
        selectedDrink.timeWhenDrank = moment();

        // add location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                selectedDrink.longitude = position.coords.longitude;
                selectedDrink.latitude = position.coords.latitude;
                this.addDrink(selectedDrink);
            },
            (error) => {
                console.error('code: ' + error.code + '\nmessage: ' + error.message + '\n');
                this.addDrink(selectedDrink);
                this.presentToast(
                    'Note: You have to allow location tracking to use the map feature.',
                    2000
                );
            }
        );
    }

    private addDrink(selectedDrink: Drink) {
        console.log(selectedDrink);

        // update localStorage drinks
        const chosenDrinks = this.data.getData('drinks');
        chosenDrinks.push(selectedDrink);
        this.data.setData('drinks', chosenDrinks);

        this.http.addDrink(
            selectedDrink.id,
            this.drinkType,
            +selectedDrink.timeWhenDrank,
            selectedDrink.longitude,
            selectedDrink.latitude
        ).subscribe();

        this.router.navigate(['dashboard']);
    }

    private async presentToast(message: string, duration: number) {
        const toast = await this.toastController.create({
            message: message,
            duration: duration,
            showCloseButton: true
        });
        toast.present();
    }

}
