import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {InsertData} from '../../interfaces/insert-data';
import {Router} from '@angular/router';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Person} from '../../entities/person';
import {ToastController} from '@ionic/angular';

/**
 * TODO: Add yummy toast
 */
@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss']
})
export class InformationComponent {

    form: FormGroup;
    date: Date;
    alreadyReg: boolean;

    constructor(private fb: FormBuilder,
                private http: HttpService,
                private dialog: Dialogs,
                private router: Router,
                private toast: ToastController) {
        this.date = new Date();
        this.form = this.fb.group({
            foreName: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern(/^[a-zA-z]*$/)]],
            surName: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern(/^[a-zA-z]*$/)]],
            age: ['', Validators.required],
            weight: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(200), Validators.min(30)]],
            height: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(230), Validators.min(150)]],
            gender: ['', [Validators.required]]
        });

        const tempPerson = JSON.parse(localStorage.getItem('person'));
        if (tempPerson) {
            const person = tempPerson.person;
            console.log(person);
            if (person) {
                this.alreadyReg = true;
                this.form.controls.foreName.setValue(person.firstName);
                this.form.controls.surName.setValue(person.lastName);
                this.form.controls.age.setValue(new Date(person.birthday).toISOString());
                // console.log(`Birthday: ${new Date(person.birthday)}\n Birthday ISO: ${new Date(person.birthday).toISOString()}`);
                this.form.controls.weight.setValue(person.weight);
                this.form.controls.height.setValue(person.height);
                this.form.controls.gender.setValue(person.gender.toUpperCase());
            }
        }
    }

    private saveData(res: InsertData) {
        localStorage.removeItem('person');
        if (!res.error) {
            res.person.user = res.user;
            res.person.gkw = this.calculateGKW(res.person);
            localStorage.setItem('person', JSON.stringify(res));
            this.alreadyReg = true;
            this.dialog.alert('Thanks for joining Dr. Booze!\nYour data will be handled carefully and discrete', 'Login finished')
                .then(
                    () => this.router.navigate(['/home']));
        }
    }

    private calculateGKW(person: Person): number {
        const age = new Date().getFullYear() - new Date(person.birthday).getFullYear();
        switch (person.gender.toUpperCase()) {
            case 'M':
                const c = 2.447 - (0.09516 * age) + (0.1074 * person.height) + (0.3362 * person.weight);
                console.log(c);
                return c;
            case 'F':
                const cd = -2.097 + (0.1069 * person.height) + (0.2466 * person.weight);
                console.log(cd);
                return cd;
        }
    }

    private saveUpdatedData(res: InsertData) {
        localStorage.removeItem('person');
        if (!res.error) {
            res.person.user = res.user;
            res.person.gkw = this.calculateGKW(res.person);
            localStorage.setItem('person', JSON.stringify(res));
            this.presentToast('Profile updated', 2000).then(
                () => this.router.navigate(['/home'])
            );
        }
    }

    onSubmit() {
        const value = this.form.value;
        this.http.insertData(value.age.toLocaleString(), value.weight, value.height, value.gender, value.foreName, value.surName)
            .subscribe(
                res => {
                    this.saveData(res);
                }
            );
    }

    onChange() {
        const value = this.form.value;
        console.log('HI');
        this.http.updateDetails(value.age.toLocaleString(), value.weight, value.height, value.gender, value.foreName, value.surName)
            .subscribe(
                res => {
                    console.log('onChange:' + res);
                    this.saveUpdatedData(res);
                });
    }

    onAutoFill() {
        this.form.controls.foreName.setValue('Guenther');
        this.form.controls.surName.setValue('Friedrich');
        const date = new Date();
        date.setFullYear(2000);
        this.form.controls.age.setValue(date.toISOString());
        this.form.controls.weight.setValue(80);
        this.form.controls.height.setValue(167);
        this.form.controls.gender.setValue('M');
    }

    private async presentToast(message: string, duration: number) {
        const toast = await this.toast.create({
            message: message,
            duration: duration,
            showCloseButton: true
        });
        toast.present();
    }
}
