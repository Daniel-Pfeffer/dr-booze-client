import {Component, OnInit} from '@angular/core';
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

    constructor(private router: Router, private menu: MenuController) {
        const tempPerson = <Person>JSON.parse(localStorage.getItem('person')).person;

        if (tempPerson !== null) {
            const person = tempPerson;
            if (person) {
                this.person = person;
            }
        }
    }

    information() {
        this.router.navigate(['/profile']);
    }

    open() {
        this.menu.enable(true, 'profile').then(() => {
            this.menu.open().then(() => {
                console.log('Profile should be open in controller');
                this.menu.isOpen().then(() => {
                    console.log('Profile is open in controller');
                });
            });
        });
    }

    close() {
        this.menu.close('profile').then(() => {
            console.log('Profile is closed');
        });
    }

    ngOnInit() {
    }

}
