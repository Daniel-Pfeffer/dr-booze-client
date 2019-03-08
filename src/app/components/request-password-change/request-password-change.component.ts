import {Component, OnInit} from '@angular/core';
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
export class RequestPasswordChangeComponent implements OnInit {
    form: FormGroup;
    error = '';

    constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router, private dialog: Dialogs) {
        this.form = this.fb.group({
            email: ['', [Validators.required,
                Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                Validators.maxLength(100)]],
        });
    }

    ngOnInit() {
    }

    onSubmit() {
        const val = this.form.value;
        console.log('Requesting password change...');
        this.httpService.requestPasswordChange(val.email).subscribe(() => {
                this.dialog.alert('Email sent!', 'Success');
            },
            (err: HttpErrorResponse) => {
                if (err.status === 409) {
                    this.dialog.alert('This email does not exist', 'Error');
                } else {
                    // TODO: Error handle unknown error
                }
            });
    }
}
