import {Component, Input} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Person} from '../../entities/person';
import {Router} from '@angular/router';
import {Challenge} from '../../interfaces/challenge';
import {HttpService} from '../../services/http.service';
import {ChallengeDisplay} from '../../interfaces/challenge-display';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    @Input()
    contentId: string;
    person: Person;
    challenges: Array<ChallengeDisplay>;
    private regexp = '\${param}';

    constructor(private router: Router,
                private http: HttpService) {
        const tempPerson = <Person>JSON.parse(localStorage.getItem('person')).person;
        this.challenges = new Array<Challenge>();

        if (tempPerson !== null) {
            const person = tempPerson;
            if (person) {
                this.person = person;
            }
        }

        http.getChallenges().subscribe(challenges => {
            challenges.forEach(challenge => {
                challenge.params.forEach(paramToInsert => {
                    challenge.desc = challenge.desc.replace(this.regexp, paramToInsert.param.toString());
                });
                this.challenges.push(new ChallengeDisplay(challenge.desc, challenge.amount));
            });
        });
    }

    onModifyData() {
        this.router.navigate(['/profile']);
    }

}
