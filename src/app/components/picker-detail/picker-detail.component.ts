import {Component, OnInit} from '@angular/core';
import {Drink} from '../../interfaces/drink';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'app-picker-detail',
    templateUrl: './picker-detail.component.html',
    styleUrls: ['./picker-detail.component.scss']
})
export class PickerDetailComponent implements OnInit {

    drinksToShow: Array<Drink>;
    moreDrinksToShow: Array<Drink>;
    chooseDrinks: Array<Drink>;
    cardid;
    name: string;
    moreName: string;

    constructor(private http: HttpService, private route: ActivatedRoute, private router: Router) {
        const lsDrinks = localStorage.getItem('drinks');
        this.chooseDrinks = lsDrinks != null ? JSON.parse(lsDrinks) : Array<Drink>();

        this.route.queryParams.subscribe(params => {
            this.cardid = params['id'];
        });

        this.drinksToShow = new Array<Drink>();
        this.moreDrinksToShow = new Array<Drink>();
        this.name = 'Beer';
        this.moreName = 'Wine';

        if (this.cardid === '1') {
            this.http.getBeer().subscribe((drinks) => this.drinksToShow = drinks);
            this.http.getWine().subscribe((drinks) => this.moreDrinksToShow = drinks);
        }

        /*
        if (this.cardid === '2') {
            this.http.getBeer().subscribe(drinks => this.drinksToShow = drinks);
        }
        if (this.cardid === 3) {
            this.http.getSpirituosen().subscribe(drinks => this.drinksToShow = drinks);
        }
        if (this.cardid === 4) {
            this.http.getPersonalDrinks().subscribe(drinks => this.drinksToShow = drinks);
        }
        */
    }

    onChoose(chosenDrink: Drink) {
        // add time when drank
        chosenDrink.timeWhenDrank = moment();
        // add location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                chosenDrink.latitude = position.coords.latitude;
                chosenDrink.longitude = position.coords.longitude;
            },
            (error) => {
                console.log('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }
        );
        this.chooseDrinks.push(chosenDrink);
        this.http.addDrink(
            chosenDrink.drinkID,
            chosenDrink.timeWhenDrank,
            chosenDrink.longitude,
            chosenDrink.latitude);
        localStorage.setItem('drinks', JSON.stringify(this.chooseDrinks));
        this.drinksToShow = this.drinksToShow.filter(item => item === null);
        this.moreDrinksToShow = this.moreDrinksToShow.filter(item => item === null);
        this.router.navigate(['dashboard']);
    }

    ngOnInit() {
    }

}
