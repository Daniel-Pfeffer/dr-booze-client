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

    private ipLocal = 'http://localhost:8080/rest/';
    private ipLocalGlobal = 'http://192.168.1.6:8080/rest/';
    private ipApp = 'http://172.17.26.124:8080/rest/';

    public header: HttpHeaders = new HttpHeaders();

    constructor(private http: HttpClient) {
        if (!!localStorage.getItem('auth')) {
            this.header = this.header.set('Authorization', 'Bearer ' + localStorage.getItem('auth'));
        }
    }

    login(username, password) {
        return this.http.post<Login>(this.ipApp + 'auth/login', {username, password});
    }

    register(email, password, username) {
        return this.http.post<Register>(this.ipApp + 'auth/register', {email, password, username});
    }

    getPerson() {
        return this.http.get<GetPerson>(this.ipApp + 'manage/getPerson', {headers: this.header});
    }

    insertData(birthday, weight, height, gender, firstName?, lastName?) {
        console.log(`bday: ${birthday}\nweight: ${weight}\nheight: ${height}\ngender: ${gender}\nfirstname: ${firstName}\nlastName: ${lastName}`);
        return this.http.post<InsertData>(this.ipApp + 'manage/insertDetails', {
            birthday,
            weight,
            height,
            gender,
            firstName,
            lastName
        }, {headers: this.header});
    }

    updateDetails(birthday, weight, height, gender, firstName?, lastName?) {
        return this.http.post<InsertData>(this.ipApp + 'manage/updateDetails', {
            birthday,
            weight,
            height,
            gender,
            firstName,
            lastName
        }, {headers: this.header});
    }

    requestPasswordChange(email) {
        return this.http.post(this.ipApp + 'auth/requestPasswordChange',
            {email},
            {observe: 'response'});
    }

    updatePassword(password, pin) {
        return this.http.post(this.ipApp + 'auth/updatePassword',
            {password, pin},
            {observe: 'response'});
    }

    getBeer() {
        return this.http.get<Array<Drink>>(this.ipApp + 'auth/getBeer', {headers: this.header});
    }

    getWine() {
        return this.http.get<Array<Drink>>(this.ipApp + 'auth/getWine', {headers: this.header});
    }
}
