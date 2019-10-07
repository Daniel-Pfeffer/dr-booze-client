import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';
import {User} from '../../entities/user';
import {HttpErrorResponse} from '@angular/common/http';

/**
 * TODO: correctly display if insert or update
 */
@Component({
    selector: 'app-information',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    form: FormGroup;
    isUpdate = false;
    date = new Date();

    constructor(private http: HttpService, private data: DataService,
                private router: Router, private toast: ToastController, fb: FormBuilder) {
        this.form = fb.group({
            firstName: ['', [Validators.minLength(1), Validators.maxLength(100),
                Validators.pattern(/^[a-zA-z]*$/)]
            ],
            lastName: ['', [Validators.minLength(1), Validators.maxLength(100),
                Validators.pattern(/^[a-zA-z]*$/)]
            ],
            birthday: ['', Validators.required],
            weight: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(200),
                Validators.min(30)]
            ],
            height: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(230),
                Validators.min(150)]
            ],
            gender: ['', [Validators.required]]
        });
        if (this.data.existsData('user')) {
            this.isUpdate = true;
            const user: User = this.data.getData('user');
            user.birthday = new Date(user.birthday);
            console.log(user.birthday);
            const controls = this.form.controls;
            controls.firstName.setValue(user.firstName);
            controls.lastName.setValue(user.lastName);
            controls.gender.setValue(user.gender.toUpperCase());
            controls.birthday.setValue(user.birthday.toISOString());
            controls.height.setValue(user.height);
            controls.weight.setValue(user.weight);
        }
    }

    onSubmit() {
        const value = this.form.value;
        this.http.setDetails(value.gender, value.birthday, value.height, value.weight, value.firstName, value.lastName)
            .subscribe(user => {
                this.saveData(user);
            }, (error: HttpErrorResponse) => {
                switch (error.status) {
                    case 401:
                        // TODO: auth token invalid -> logout
                        break;
                    case 403:
                        this.presentToast('At least one of the given credentials is invalid');
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
        const date = new Date();
        date.setFullYear(2000, 1, 31);
        controls.birthday.setValue(date.toISOString());
        controls.height.setValue(167);
        controls.weight.setValue(80);
    }

    private saveData(user: User) {
        console.log(this.isUpdate);
        if (this.data.existsData('user')) {
            this.data.removeData('user');
        }
        user.gkw = this.calculateGKW(user);
        this.data.setData('user', user);
        const message = this.isUpdate ? 'Profile updated' : 'Thanks for joining Dr. Booze!';
        this.presentToast(message).then(() => this.router.navigate(['/home']));
    }

    private calculateGKW(user: User): number {
        console.log(user);
        const age = new Date().getFullYear() - new Date(user.birthday).getFullYear();
        console.log(age);
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
