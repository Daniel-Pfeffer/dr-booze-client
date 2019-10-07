import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';
import {SecureStorage, SecureStorageObject} from '@ionic-native/secure-storage/ngx';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;

    // activatedMailResponse: string;

    constructor(private http: HttpService, private data: DataService, private router: Router,
                private activatedRoute: ActivatedRoute, private toastController: ToastController, fb: FormBuilder,
                private ss: SecureStorage) {
        this.form = fb.group({
            username:
                ['', [Validators.required]],
            password:
                ['', [Validators.required,
                    Validators.pattern(/^.*(?=.{8,})(?=.*\d)((?=.*[a-z]))((?=.*[A-Z])).*$/),
                    Validators.maxLength(25)]
                ]
        });
    }

    ngOnInit(): void {
        this.ss.create('drBoozeSS').then((storage: SecureStorageObject) => {
            storage.get('auth').then(
                (data) => {
                    console.log(data);
                },
                (error) => {
                    console.log(error);
                });
        });
    }

    onSubmit() {
        const val = this.form.value;
        this.http.login(val.username, val.password).subscribe(loginRes => {
                this.http.header = this.http.header.set('Authorization', 'Bearer ' + loginRes.token);
                this.data.setData('auth', loginRes.token);
                this.ss.create('drBoozeSS').then((storage: SecureStorageObject) => {
                    storage.set('auth', loginRes.token).then(
                        (data) => {
                            console.log(data);
                        },
                        (error) => {
                            console.log(error);
                        });
                });
                this.http.getUser().subscribe(user => {
                    console.log(user.birthday);
                    this.data.setData('user', user);
                    this.router.navigate(['/home']);
                }, (error: HttpErrorResponse) => {
                    switch (error.status) {
                        case 401:
                            // the authentication token is missing or invalid
                            this.data.removeData('auth');
                            this.data.removeData('user');
                            break;
                        case 409:
                            // the details haven't been inserted yet
                            this.router.navigate(['/profile']);
                            break;
                        default:
                            this.presentToast('An unexpected error occurred. Please try again');
                            console.error(error);
                            break;
                    }
                });
            }, (error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.presentToast('Username or password is wrong');
                } else {
                    console.error(error);
                }
            }
        );
    }

    onAutoFill() {
        this.form.setValue({username: 'Boozeman', password: 'v3rySafePassw0rd'});
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
