import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';
import {User} from '../../data/entities/user';
import {StorageType} from '../../data/enums/StorageType';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    form: FormGroup;

    constructor(private http: HttpService,
                private data: DataService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private toastController: ToastController,
                private backgroundMode: BackgroundMode,
                private notification: LocalNotifications,
                private s: StorageService,
                fb: FormBuilder) {
        const authToken = s.get(StorageType.AUTH);
        if (!!authToken) {
            this.s.load().then(() => {
                this.login(authToken);
            });
        }
        this.form = fb.group({
            username:
                ['', [Validators.required]],
            password:
                ['', [Validators.required,
                    Validators.pattern(/^.*(?=.{6,})((?=.*[a-z])).*$/),
                    Validators.maxLength(25)]
                ]
        });
    }

    onSubmit() {
        const val = this.form.value;
        this.http.login(val.username, val.password).subscribe(loginRes => {
                this.login(loginRes.token);
            }, (error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.presentToast('Username or password is wrong.');
                } else {
                    console.error(error);
                }
            }
        );
    }

    onAutoFill() {
        this.form.setValue({username: 'Boozeman', password: 'v3rySafePassw0rd'});
    }

    private login(token) {
        this.http.header = this.http.header.set('Authorization', 'Bearer ' + token);
        const {AUTH, PERSON} = StorageType;
        this.data.set(AUTH, token);
        this.notification.requestPermission();
        this.backgroundMode.enable();
        this.http.getUser().subscribe(user => {
            user.gkw = this.calculateGKW(user);
            this.data.set(PERSON, user);
            this.router.navigate(['/home']);
        }, (error: HttpErrorResponse) => {
            switch (error.status) {
                case 401:
                    // the authentication token is missing or invalid
                    this.data.remove(AUTH);
                    this.data.remove(PERSON);
                    break;
                case 409:
                    // the details haven't been inserted yet
                    this.router.navigate(['/profile']);
                    break;
                default:
                    this.presentToast('An unexpected error occurred. Please try again.');
                    console.error(error);
                    this.data.remove(AUTH);
                    break;
            }
        });
    }

    private calculateGKW(user: User): number {
        const age = new Date().getFullYear() - new Date(user.birthday).getFullYear();
        switch (user.gender.toUpperCase()) {
            case 'M':
                return 2.447 - (0.09516 * age) + (0.1074 * user.height) + (0.3362 * user.weight);
            case 'F':
                return -2.097 + (0.1069 * user.height) + (0.2466 * user.weight);
        }
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
