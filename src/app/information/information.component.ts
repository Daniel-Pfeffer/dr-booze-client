import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss']
})
export class InformationComponent {
    form: FormGroup;
    date: Date;

    constructor(private fb: FormBuilder) {
        this.date = new Date();
        this.form = this.fb.group({
            foreName: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern(/^[a-zA-z]*$/)]],
            surName: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern(/^[a-zA-z]*$/)]],
            age: ['', Validators.required],
            weight: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            height: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            gender: ['', [Validators.required]]
        });
    }

    onSubmit() {
    }
}
