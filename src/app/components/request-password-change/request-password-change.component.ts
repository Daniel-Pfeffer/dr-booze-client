import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {HttpErrorResponse} from '@angular/common/http';

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

    constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router, private dialog: Dialogs) {
        this.formRequest = this.fb.group({
            email: ['', [Validators.required,
                Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                Validators.maxLength(100)]],
        });
        this.formUpdate = this.fb.group({
            password: ['', [Validators.required]],
            pin: ['', [Validators.required]]
        });
    }

    onSendRequest() {
        this.hasSentEmail = true;
        const val = this.formRequest.value;
        this.httpService.requestPasswordChange(val.email).subscribe(() => {
                this.dialog.alert('Email sent!', 'Success');
            },
            (err: HttpErrorResponse) => {
                this.hasSentEmail = false;
                let errorMsg: string;
                if (err.status === 409) {
                    errorMsg = 'This email does not exist';
                } else if (err.status === 401) {
                    errorMsg = 'This email has not been confirmed';
                } else {
                    errorMsg = 'An unknown error occurred';
                }
                this.dialog.alert(errorMsg, 'Error');
            });
    }

    onPasswordReset() {
        const val = this.formUpdate.value;
        this.httpService.changePassword(val.password, val.pin).subscribe(() => {
                this.dialog.alert('Your password has been successfully updated', 'Success');
                this.router.navigate(['login']);
            },
            (err: HttpErrorResponse) => {
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
                this.dialog.alert(errorMsg, 'Error');
            });
    }
}
