import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    form: FormGroup;

    constructor(private http: HttpService,
                private router: Router,
                private toastController: ToastController,
                fb: FormBuilder) {
        this.form = fb.group({
            email:
                ['', [Validators.required,
                    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                    Validators.maxLength(100)]
                ],
            password:
                ['', [Validators.required,
                    Validators.pattern(/^.*(?=.{6,})((?=.*[a-z])).*$/),
                    Validators.maxLength(25)]
                ],
            username:
                ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]]
        });
    }

    onSubmit() {
        const val = this.form.value;
        this.http.register(val.username, val.email, val.password).subscribe(() => {
            this.presentToast('Registration completed.').then(() => this.router.navigate(['login']));
        }, (error: HttpErrorResponse) => {
            switch (error.status) {
                case 403:
                    this.presentToast('The entered username, email or password is invalid.');
                    break;
                case 409:
                    this.presentToast('The entered username or email already exists.');
                    break;
                default:
                    this.presentToast('An unexpected error occurred. Please try again.');
                    console.error(error);
                    break;
            }
        });
    }

    onAutoFill() {
        this.form.setValue({username: 'Boozeman', email: 'dr.boozeteam@gmail.com', password: 'v3rySafePassw0rd'});
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
