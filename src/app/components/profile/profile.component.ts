import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';
import {User} from '../../data/entities/user';
import {HttpErrorResponse} from '@angular/common/http';
import {StorageType} from '../../data/enums/StorageType';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    form: FormGroup;
    isUpdate = false;
    date = new Date();

    constructor(private http: HttpService,
                private data: DataService,
                private router: Router,
                private toast: ToastController,
                fb: FormBuilder) {
        this.form = fb.group({
            firstName: ['', [Validators.minLength(2), Validators.maxLength(100),
                Validators.pattern(/^([a-zA-Z]{2,})(?:(?: |-)?([a-zA-Z]+))*$/)]
            ],
            lastName: ['', [Validators.minLength(1), Validators.maxLength(100),
                Validators.pattern(/^([a-zA-Z]*)(?:-?([a-zA-Z]*))*$/)]
            ],
            birthday: ['', Validators.required],
            weight: ['', [Validators.required, Validators.pattern(/\d+/), Validators.max(200),
                Validators.min(30)]
            ],
            height: ['', [Validators.required, Validators.pattern(/\d+/), Validators.max(230),
                Validators.min(150)]
            ],
            gender: ['', [Validators.required]]
        });
    }

    /**
     * This function is called from ionic when the view becomes visible to the user.
     * It is not unused.
     */
    ionViewWillEnter() {
        const {PERSON} = StorageType;
        if (this.data.exist(PERSON)) {
            this.isUpdate = true;
            const user: User = this.data.get(PERSON);
            const controls = this.form.controls;
            controls.firstName.setValue(user.firstName);
            controls.lastName.setValue(user.lastName);
            controls.gender.setValue(user.gender.toUpperCase());
            controls.birthday.setValue(new Date(user.birthday).toISOString());
            controls.height.setValue(user.height);
            controls.weight.setValue(user.weight);
        }
    }

    onSubmit() {
        const value = this.form.value;
        this.http.setDetails(value.gender, Date.parse(value.birthday), value.height, value.weight, value.firstName, value.lastName)
            .subscribe(user => {
                this.saveData(user);
            }, (error: HttpErrorResponse) => {
                switch (error.status) {
                    case 401:
                        // TODO: auth token invalid -> logout
                        break;
                    case 403:
                        this.presentToast('At least one of the given credentials is invalid.');
                        break;
                    default:
                        console.error(error);
                        break;
                }
            });
    }

    onAutoFill() {
        const controls = this.form.controls;
        controls.firstName.setValue('Dr');
        controls.lastName.setValue('Booze');
        controls.gender.setValue('M');
        controls.birthday.setValue('2000-01-31T00:00:00.000Z');
        controls.height.setValue(167);
        controls.weight.setValue(80);
    }

    private saveData(user: User) {
        const {PERSON} = StorageType;
        if (this.data.exist(PERSON)) {
            this.data.remove(PERSON);
        }
        user.gkw = this.calculateGKW(user);
        this.data.set(PERSON, user);
        const message = this.isUpdate ? 'Profile updated' : 'Thanks for joining Dr. Booze!';
        this.presentToast(message).then(() => this.router.navigate(['/home']));
    }

    private calculateGKW(user: User): number {
        const age = new Date().getFullYear() - new Date(user.birthday).getFullYear();
        switch (user.gender.toUpperCase()) {
            case 'M':
                const c = 2.447 - (0.09516 * age) + (0.1074 * user.height) + (0.3362 * user.weight);
                console.log(c);
                return c;
            case 'F':
                const cd = -2.097 + (0.1069 * user.height) + (0.2466 * user.weight);
                console.log(cd);
                return cd;
        }
    }

    private async presentToast(message: string) {
        const toast = await this.toast.create({
            message: message,
            duration: 2000,
            keyboardClose: true,
            showCloseButton: true
        });
        await toast.present();
    }
}
