import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Challenge} from '../../data/interfaces/challenge';
import {HttpService} from '../../services/http.service';
import {ChallengeDisplay} from '../../data/interfaces/challenge-display';
import {DataService} from '../../services/data.service';
import {User} from '../../data/entities/user';
import {StorageType} from '../../data/enums/StorageType';
import {MenuController, ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

    @Input()
    contentId: string;
    user: User;
    challenges: Array<ChallengeDisplay>;
    private regexp = '\${param}';

    constructor(private http: HttpService,
                private data: DataService,
                private router: Router,
                private toastController: ToastController,
                private menuController: MenuController,
                private s: Storage) {
        this.challenges = new Array<Challenge>();
        this.user = this.data.get(StorageType.PERSON);
        this.http.getChallenges().subscribe(challenges => {
            challenges.forEach(challenge => {
                challenge.params.reverse().forEach(paramToInsert => {
                    challenge.desc = challenge.desc.replace(this.regexp, paramToInsert.param.toString());
                });
                this.challenges.push(new ChallengeDisplay(challenge.desc, challenge.amount));
            });
        });
    }

    onEdit() {
        this.router.navigate(['/profile']);
        this.menuController.close('side-menu');
        const sub = this.data.personObs.subscribe(_ => {
            this.user = this.data.get(StorageType.PERSON);
            sub.unsubscribe();
        });
    }

    onLogout() {
        this.data.clear();
        this.s.clear();
        this.presentToast('Successfully logged out').then(() => this.router.navigate(['login']));
    }

    private async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            showCloseButton: true,
            keyboardClose: true
        });
        await toast.present();
    }
}
