/*
Handles ALL HTTP/s-Request
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Login} from '../interfaces/login';
import {Register} from '../interfaces/register';
import {InsertData} from '../interfaces/insert-data';
import {GetPerson} from '../interfaces/get-person';
import {Drink} from '../interfaces/drink';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private ip = 'http://172.18.107.163:8080/rest/';

    public header: HttpHeaders = new HttpHeaders();

    constructor(private http: HttpClient) {
        if (!!localStorage.getItem('auth')) {
            this.header = this.header.set('Authorization', 'Bearer ' + localStorage.getItem('auth'));
        }
    }

    login(username, password) {
        return this.http.post<Login>(this.ip + 'auth/login', {username, password});
    }

    register(email, password, username) {
        return this.http.post<Register>(this.ip + 'auth/register', {email, password, username});
    }

    getPerson() {
        return this.http.get<GetPerson>(this.ip + 'manage/getPerson', {headers: this.header});
    }

    insertData(birthday, weight, height, gender, firstName?, lastName?) {
        console.log(`bday: ${birthday}\nweight: ${weight}\nheight: ${height}\ngender: ${gender}\nfirstname: ${firstName}\nlastName: ${lastName}`);
        return this.http.post<InsertData>(this.ip + 'manage/insertDetails', {
            birthday,
            weight,
            height,
            gender,
            firstName,
            lastName
        }, {headers: this.header});
    }

    updateDetails(birthday, weight, height, gender, firstName?, lastName?) {
        return this.http.post<InsertData>(this.ip + 'manage/updateDetails', {
            birthday,
            weight,
            height,
            gender,
            firstName,
            lastName
        }, {headers: this.header});
    }

    requestPasswordChange(email) {

        return this.http.post(this.ip + 'auth/requestPasswordChange',
            {email},
            {observe: 'response'});
    }

    updatePassword(password, pin) {

        return this.http.post(this.ip + 'auth/updatePassword',

            {password, pin},
            {observe: 'response'});
    }

    getBeer() {
        return this.http.get<Array<Drink>>(this.ip + 'getter/getBeer', {headers: this.header});
    }

    getWine() {
        return this.http.get<Array<Drink>>(this.ip + 'getter/getWine', {headers: this.header});
    }
/*
    getCocktails() {
        return this.http.get<Array<Drink>>(this.ipApp + 'auth/getCocktails', {headers: this.header});
    }

    getSpirituosen() {
        return this.http.get<Array<Drink>>(this.ipApp + 'auth/getSpirituosen', {headers: this.header});
    }

    getPersonalDrinks() {
        return this.http.get<Array<Drink>>(this.ipApp + 'auth/getPersonalDrinks', {headers: this.header});
    }*/
}
