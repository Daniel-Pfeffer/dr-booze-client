import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../services/http.service';
import {InsertData} from '../interfaces/insert-data';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Router} from '@angular/router';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss']
})
export class InformationComponent {

    form: FormGroup;
    date: Date;

    constructor(private fb: FormBuilder, private http: HttpService, private dialog: Dialogs, private router: Router) {
        this.date = new Date();
        this.form = this.fb.group({
            foreName: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern(/^[a-zA-z]*$/)]],
            surName: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern(/^[a-zA-z]*$/)]],
            age: ['', Validators.required],
            weight: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(200), Validators.min(30)]],
            height: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(230), Validators.min(150)]],
            gender: ['', [Validators.required]]
        });

        const person = JSON.parse(localStorage.getItem('user')).person;
        if (person) {
            this.form.controls.foreName.setValue(person.firstName);
            this.form.controls.surName.setValue(person.lastName);
            this.form.controls.age.setValue(new Date(person.birthday).toISOString());
            console.log(`Birthday: ${new Date(person.birthday)}\n Birthday ISO: ${new Date(person.birthday).toISOString()}`);
            this.form.controls.weight.setValue(person.weight);
            this.form.controls.height.setValue(person.height);
            this.form.controls.gender.setValue(person.gender.toUpperCase());
        }
    }

    private saveDate(res: InsertData) {
        localStorage.removeItem('user');
        if (!res.error) {
            localStorage.setItem('user', JSON.stringify(res));
            this.dialog.alert('Thanks for joining Dr. Booze!\nYour data will be handled carefully and discrete', 'Login finished')
                .then(
                    () => this.router.navigate(['/home']));
        }
    }

    onSubmit() {
        const value = this.form.value;
        this.http.insertData(value.age.toLocaleString(), value.weight, value.height, value.gender, value.foreName, value.surName).subscribe(res => this.saveDate(res));
    }

    onChange() {

    }
}
