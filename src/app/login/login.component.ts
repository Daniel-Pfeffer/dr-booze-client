import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../services/http.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    activatedMailResponse: string;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private dialog: Dialogs, private activatedRoute: ActivatedRoute, private httpService: HttpService) {
        this.form = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.pattern(/^.*(?=.{8,})(?=.*\d)((?=.*[a-z]))((?=.*[A-Z])).*$/), Validators.maxLength(25)]]
        });
    }

    onSubmit() {
        const val = this.form.value;
        this.httpService.login(val.username, val.password).subscribe(item => {
            if (!item.error) {
                AuthService.setToken(item);
                if (item.user.person == null) {
                    this.dialog.alert(`Hello ${item.user.username}`, 'Login')
                        .then(
                            () => this.router.navigate(['/profile']));
                } else {
                    if (item.user.person.firstName !== undefined || item.user.person.firstName != null) {
                        this.dialog.alert(`Hello ${item.user.person.firstName}`, 'Hello')
                            .then(
                                () => this.router.navigate(['/home']));
                    } else {
                        this.dialog.alert(`Hello ${item.user.username}`, 'Hello')
                            .then(
                                () => this.router.navigate(['/home']));
                    }
                }
            } else {
                this.openDialogCustomMsg('Username or password invalid');
            }
        });
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            const activatedMail = params['token'];
            if (activatedMail) {
                if (activatedMail === 'true') {
                    this.activatedMailResponse = 'Your account was successfully activated. You now can login';
                } else {
                    this.activatedMailResponse = 'Your account wasn\'t activated. Please login and try again. Note that you can\'t use the app properly without a verified account';
                }
                this.openDialogCustomMsg(this.activatedMailResponse);
            }
        });
    }

    private openDialogCustomMsg(msg) {
        this.dialog.alert(msg, 'Mail Activation', 'OK');
    }
}
