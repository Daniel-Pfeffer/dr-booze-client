import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';
import {User} from '../../entities/user';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-information',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    form: FormGroup;
    isUpdate: boolean;
    date = new Date();

    constructor(private http: HttpService, private router: Router,
                private toast: ToastController, private data: DataService, fb: FormBuilder) {
        this.form = fb.group({
            firstName: ['', [Validators.minLength(1), Validators.maxLength(100),
                Validators.pattern(/^[a-zA-z]*$/)]
            ],
            lastName: ['', [Validators.minLength(1), Validators.maxLength(100),
                Validators.pattern(/^[a-zA-z]*$/)]
            ],
            age: ['', Validators.required],
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
            this.form.controls.firstName.setValue(user.firstName);
            this.form.controls.lastName.setValue(user.lastName);
            this.form.controls.gender.setValue(user.gender.toUpperCase());
            this.form.controls.age.setValue(new Date(user.birthday).toISOString());
            this.form.controls.height.setValue(user.height);
            this.form.controls.weight.setValue(user.weight);
        }
    }

    onSubmit() {
        const value = this.form.value;
        this.http.insertDetails(value.gender, value.age.toLocaleString(), value.height, value.weight, value.firstName, value.lastName)
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

    onChange() {
        const value = this.form.value;
        this.http.updateDetails(value.age.toLocaleString(), value.weight, value.height, value.gender, value.firstName, value.lastName)
            .subscribe(user => {
                this.saveUpdatedData(user);
            }, (error: HttpErrorResponse) => {
                switch (error.status) {
                    case 401:
                        // TODO: auth token invalid -> logout
                        break;
                    case 403:
                        this.presentToast('At least one of the given credentials is invalid');
                        break;
                    case 409:
                        this.presentToast('Cannot change the profile if it has not been inserted yet');
                        break;
                    default:
                        console.log(error);
                        break;
                }
            });
    }

    onAutoFill() {
        this.form.controls.firstName.setValue('Dr');
        this.form.controls.lastName.setValue('Booze');
        this.form.controls.gender.setValue('M');
        const date = new Date();
        date.setFullYear(2000);
        this.form.controls.age.setValue(date.toISOString());
        this.form.controls.weight.setValue(80);
        this.form.controls.height.setValue(167);
    }

    private saveData(user: User) {
        if (this.data.existsData('user')) {
            this.data.removeData('user');
        }
        user.gkw = this.calculateGKW(user);
        this.data.setData('user', user);
        this.isUpdate = true;
        this.presentToast('Thanks for joining Dr. Booze!').then(() => this.router.navigate(['/home']));
    }

    private saveUpdatedData(user: User) {
        if (this.data.existsData('user')) {
            this.data.removeData('user');
        }
        user.gkw = this.calculateGKW(user);
        this.data.setData('user', user);
        this.presentToast('Your profile has been updated').then(() => this.router.navigate(['/home']));
    }

    private calculateGKW(user: User): number {
        console.log(user);
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
