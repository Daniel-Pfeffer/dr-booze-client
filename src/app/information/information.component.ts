import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../services/http.service';
import {InsertData} from '../interfaces/insert-data';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss']
})
export class InformationComponent {

    form: FormGroup;
    date: Date;

    constructor(private fb: FormBuilder, private http: HttpService) {
        this.date = new Date();
        this.form = this.fb.group({
            foreName: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern(/^[a-zA-z]*$/)]],
            surName: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern(/^[a-zA-z]*$/)]],
            age: ['', Validators.required],
            weight: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(200), Validators.min(30)]],
            height: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(230), Validators.min(150)]],
            gender: ['', [Validators.required]]
        });
    }

    private static saveDate(res: InsertData) {
        localStorage.removeItem('user');
        if (!res.error) {
            localStorage.setItem('user', JSON.stringify(res));
        }
    }

    onSubmit() {
        const value = this.form.value;
        this.http.insertData(value.age.toLocaleString(), value.weight, value.height, value.gender, value.foreName, value.surName).subscribe(res => InformationComponent.saveDate(res));
    }
}
