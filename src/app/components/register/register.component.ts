import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {SwitchError} from '../../helper/switch-error';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Person} from '../../entities/person';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    form: FormGroup;
    error = '';

    constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router,
                private dialog: Dialogs, private switcher: SwitchError) {
        this.form = this.fb.group({
            email:
                ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(100)]],
            password:
                ['', [Validators.required, Validators.pattern(/^.*(?=.{8,})(?=.*\d)((?=.*[a-z]))((?=.*[A-Z])).*$/), Validators.maxLength(25)]],
            username:
                ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]]
        });
    }

    onSubmit() {
        const val = this.form.value;
        console.log(val);
        // get an login object which maybe consists of an error array and a user object
        this.httpService.register(val.email, val.password, val.username).subscribe(item => {
            // console.log(item);
            // if there are any errors than proceed with error logging
            if (item.error) {
                // if there are more than one error loop through them. Otherwise just log the one
                if (Array.isArray(item.error)) {
                    item.error.forEach(error => {
                        // switch through all errors if there are more than 2 and output it on a dialog
                        this.error += this.switcher.switcher(error);
                    });
                } else {
                    this.error = this.switcher.switcher(item.error);
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

    private openDialog() {
        this.dialog.alert('Welcome to Dr. Booze', 'Welcome', 'Dismiss')
            .then(() =>
                this.router.navigate(['login']));
    }

    onAutoFill() {
        this.form.setValue({username: 'User1', email: 'dr.boozeteam@gmail.com', password: 's3fePassword'});
    }

    onAutoLog() {
        const person: Person = new Person();
        localStorage.setItem('auth', '');
        localStorage.setItem('person', JSON.stringify(person));
    }
}
