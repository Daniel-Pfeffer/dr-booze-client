import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpService} from '../services/http.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {CustomError} from '../interfaces/error';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    form: FormGroup;
    error = '';

    /*
    FormBuilder is used to build form validator and get all form values without 2 the 2-way-binding of ngModel
    HttpService is used for all transaction happening through the http protocol
    Router is used for routing
    Dialog similar to the alert pop up

    do not mess with the constructor especially do not mess with the patterns
    */

    constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router, private dialog: Dialogs) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ), Validators.maxLength(100)]],
            password: ['', [Validators.required, Validators.pattern(/^.*(?=.{8,})(?=.*\d)((?=.*[a-z]))((?=.*[A-Z])).*$/), Validators.maxLength(25)]],
            username: ['', Validators.required]
        });
    }

    // handles what happens after an submit
    onSubmit() {
        const val = this.form.value;
        console.log(val);
        // get an login object which maybe consists of an error array and a user object
        this.httpService.register(val.email, val.password, val.username).subscribe(item => {
            console.log(item);
            // if there are any errors than proceed with error logging
            if (item.error) {
                // if there are more than one error loop through them. Otherwise just log the one
                if (Array.isArray(item.error)) {
                    item.error.forEach(error => {
                        // switch through all errors if there are more than 2 and output it on a dialog
                        this.switchError(error);
                    });
                } else {
                    this.switchError(item.error);
                }
                // displays the snackbar with the message this.error and the button OK
                this.dialog.alert(this.error, 'ERROR', 'DISMISS');
                // resets the error log
                this.error = '';
            } else {
                // if no error was received redirect to the login page
                this.openDialog();
            }
        });
    }

    // switches through all errors and get an error message
    switchError(error: CustomError) {
        switch (error.error_code) {
            case 601:
                this.error += error.error_reason + ' can´t be empty\n';
                break;
            case 602:
                this.error += error.error_reason + ' is already taken\n';
                break;
            case 603:
                /* Todo: extend tree for size
                    error_codes on discord
                 *  add all size options
                */
                this.error += error.error_reason + 's size isn´t correct\n';
                break;
            case 604:
                this.error += this.form.value.email + ' isn´t an email\n';
                break;
            default:
                this.error += 'Sorry what';
                break;
        }
    }

    private openDialog() {
        this.dialog.alert('Welcome to Dr. Booze', 'Welcome', 'Dismiss')
            .then(() =>
                this.router.navigate(['login']));
    }
}
