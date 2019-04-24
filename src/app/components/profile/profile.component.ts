import { Component, OnInit } from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Person} from '../../entities/person';
import {Router} from '@angular/router';
import {User} from '../../entities/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

person: Person;
optionalName: String;

  constructor(private router : Router) {
    const tempPerson = JSON.parse(localStorage.getItem('person'));
    if (tempPerson) {
      const person = tempPerson.person;
      if (person) {
        this.person = person;
      }
    }
  }

 information(){
    this.router.navigate(['/profile']);
 }




ngOnInit() {
  }

}
