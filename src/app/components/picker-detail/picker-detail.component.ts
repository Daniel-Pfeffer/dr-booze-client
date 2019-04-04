import { Component, OnInit } from '@angular/core';
import {Drink} from '../../interfaces/drink';
import {HttpService} from '../../services/http.service';
import {DrinkPicker} from '../../entities/drinkPicker';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {callRule} from '@angular-devkit/schematics';

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
    this.chooseDrinks = JSON.parse(localStorage.getItem('drinks')) ? JSON.parse(localStorage.getItem('drinks')) : new Array<Drink>();
    this.route.queryParams.subscribe(params => {
      this.cardid = params['id'];
    });
    console.log(typeof this.cardid);
    console.log(this.cardid);
    this.drinksToShow = new Array<Drink>();
    this.moreDrinksToShow = new Array<Drink>();

    if (this.cardid == 1) {
      this.name = 'Beer';
      this.moreName = 'Wine';
    this.http.getBeer().subscribe((drinks) => {
      this.drinksToShow = drinks;
      console.log(drinks);
    });
      this.http.getWine().subscribe((drinks) => this.moreDrinksToShow = drinks);
    }

    if (this.cardid == 2) {
      this.http.getBeer().subscribe(drinks => this.drinksToShow = drinks);
    }/*
   if (this.cardid === 3) {
      this.http.getSpirituosen().subscribe(drinks => this.drinksToShow = drinks);
    }
    if (this.cardid === 4) {
      this.http.getPersonalDrinks().subscribe(drinks => this.drinksToShow = drinks);
    }*/
  }

  onChoose(chosenDrink) {
    console.log(chosenDrink);
    this.chooseDrinks.push(chosenDrink);
    console.log(this.chooseDrinks);
    localStorage.setItem('drinks', JSON.stringify(this.chooseDrinks));
    this.drinksToShow = this.drinksToShow.filter(item => item === null);
    this.moreDrinksToShow = this.moreDrinksToShow.filter(item => item === null);
    console.log(this.drinksToShow);
    console.log(this.moreDrinksToShow);
    this.router.navigate(['dashboard']);
  }

  ngOnInit() {

  }

}
