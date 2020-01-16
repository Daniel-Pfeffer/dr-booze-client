import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-request-password-change',
    templateUrl: './request-password-change.component.html',
    styleUrls: ['./request-password-change.component.scss']
})
export class RequestPasswordChangeComponent {

    formRequest: FormGroup;
    formUpdate: FormGroup;
    error = '';
    hasSentEmail = false;

    constructor(private httpService: HttpService,
                private router: Router,
                private toastController: ToastController,
                fb: FormBuilder) {
        this.formRequest = fb.group({
            email: ['', [Validators.required,
                Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                Validators.maxLength(100)]],
        });
        this.formUpdate = fb.group({
            password: ['', [Validators.required]],
            pin: ['', [Validators.required]]
        });
    }

    onSendRequest() {
        const val = this.formRequest.value;
        this.httpService.requestPasswordChange(val.email).subscribe(() => {
            this.hasSentEmail = true;
            this.presentToast('Email has been sent!');
        }, (err: HttpErrorResponse) => {
            this.hasSentEmail = false;
            let errorMsg: string;
            if (err.status === 409) {
                errorMsg = 'This email does not exist';
            } else if (err.status === 403) {
                errorMsg = 'This email has not been confirmed';
            } else {
                errorMsg = 'An unknown error occurred';
            }
            this.presentToast(errorMsg);
        });
    }

    onPasswordReset() {
        const val = this.formUpdate.value;
        this.httpService.changePassword(val.pin, val.password).subscribe(() => {
            this.presentToast('Your password has been successfully updated');
            this.router.navigate(['']);
        }, (err: HttpErrorResponse) => {
            let errorMsg: string;
            if (err.status === 404) {
                errorMsg = 'This pin is incorrect';
            } else if (err.status === 403) {
                errorMsg = 'The pin has expired';
            } else if (err.status === 409) {
                errorMsg = 'The entered password is not valid';
            } else {
                errorMsg = 'An unknown error has occurred';
            }
            this.presentToast(errorMsg);
        });
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
