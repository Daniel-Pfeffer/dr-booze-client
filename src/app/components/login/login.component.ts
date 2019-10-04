import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    activatedMailResponse: string;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
                private dialog: Dialogs, private activatedRoute: ActivatedRoute, private httpService: HttpService) {
        this.form = this.fb.group({
            username:
                ['', [Validators.required]],
            password:
                ['', [Validators.required, Validators.pattern(/^.*(?=.{8,})(?=.*\d)((?=.*[a-z]))((?=.*[A-Z])).*$/), Validators.maxLength(25)]]
        });
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            const activatedMail = params['token'];
            if (activatedMail) {
                if (activatedMail === 'true') {
                    this.activatedMailResponse = 'Your account was successfully activated. You now can login';
                } else {
                    this.activatedMailResponse =
                        'Your account wasn\'t activated. Please login and try again.' +
                        ' Note that you can\'t use the app properly without a verified account';
                }
                this.openSnackbar(this.activatedMailResponse);
            }
        });
    }

    onSubmit() {
        const val = this.form.value;
        this.httpService.login(val.username, val.password).subscribe(item => {
            console.log('token from rep ' + item.token);

            if (!item.error) {
                this.httpService.header = this.httpService.header.set('Authorization', 'Bearer ' + item.token);
                console.log(this.httpService.header.keys());
                console.log('token in auth ' + this.httpService.header.get('Authorization'));

                this.httpService.getPerson().subscribe(person => {

                    if (!person.error) {
                        console.log(person);
                        this.authService.setToken(item.token, person);

                        if (person.person == null) {
                            this.router.navigate(['/profile']);
                        } else {
                            this.router.navigate(['/home']);
                        }
                    }
                });
            } else {
                this.dialog.alert('Username or password invalid', 'Error', 'OK');
            }
        });
    }

    private openSnackbar(msg) {
        this.dialog.alert(msg, 'Mail Activation', 'OK');
    }

    onAutoFill() {
        this.form.setValue({username: 'User1', password: 's3fePassword'});
    }

}
