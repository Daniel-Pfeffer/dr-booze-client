import {Component, Input} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Person} from '../../entities/person';
import {Router} from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    @Input()
    contentId: string;

    person: Person;

    constructor(private router: Router,
                private menu: MenuController) {
        const tempPerson = <Person>JSON.parse(localStorage.getItem('person')).person;

        if (tempPerson !== null) {
            const person = tempPerson;
            if (person) {
                this.person = person;
            }
        }
    }

    onModifyData() {
        this.router.navigate(['/profile']);
    }

    onClose() {
        this.menu.close('profile');
    }

}
