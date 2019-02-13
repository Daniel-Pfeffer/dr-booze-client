import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Drink} from '../../interfaces/drink';

@Component({
    selector: 'app-pick-main',
    templateUrl: './pick-main.component.html',
    styleUrls: ['./pick-main.component.scss']
})
export class PickMainComponent {
    beer: Array<Drink>;
    wine: Array<Drink>;

    constructor(private http: HttpService) {
        this.http.getBeer().subscribe(drinks => this.beer = drinks);
        this.http.getWine().subscribe(drinks => this.wine = drinks);
    }

}
