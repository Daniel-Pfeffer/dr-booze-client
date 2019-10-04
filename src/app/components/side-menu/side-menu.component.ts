import {Component, Input} from '@angular/core';
import {Person} from '../../entities/person';
import {Router} from '@angular/router';
import {Challenge} from '../../interfaces/challenge';
import {HttpService} from '../../services/http.service';
import {ChallengeDisplay} from '../../interfaces/challenge-display';
import {AuthService} from '../../services/auth.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {DataService} from '../../services/data.service';

@Component({
    selector: 'app-profile',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

    @Input()
    contentId: string;
    person: Person;
    challenges: Array<ChallengeDisplay>;
    private regexp = '\${param}';

    constructor(private router: Router,
                private http: HttpService,
                private dialog: Dialogs,
                private data: DataService,
                private auth: AuthService
    ) {
        const tempPerson = this.data.getData('person').person;
        this.challenges = new Array<Challenge>();

        if (tempPerson !== null) {
            const person = tempPerson;
                if (person) {
                    this.person = person;
            }
        }

        http.getChallenges().subscribe(challenges => {
            challenges.forEach(challenge => {
                challenge.params.reverse().forEach(paramToInsert => {
                    challenge.desc = challenge.desc.replace(this.regexp, paramToInsert.param.toString());
                });
                this.challenges.push(new ChallengeDisplay(challenge.desc, challenge.amount));
            });
        });
    }

    onModifyData() {
        this.router.navigate(['/profile']);
    }

    onLogout() {
        this.auth.logout();
        this.dialog.alert(`Successfully logged out`, 'Logout')
            .then(() => this.router.navigate(['login']));
    }

}
