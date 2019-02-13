/*
Handles ALL HTTP/s-Request
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Login} from '../interfaces/login';
import {Register} from '../interfaces/register';
import {User} from '../entities/user';
import {InsertData} from '../interfaces/insert-data';
import {Person} from '../entities/person';
import {GetPerson} from '../interfaces/get-person';
import {Drink} from '../interfaces/drink';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    // private IP of burgi probably changes all the time pls change if changed
    private ipBorgi = 'http://192.168.137.1:8080/rest/auth/';
    private ipLocal = 'http://localhost:8080/rest/';
    private ipLocalGlobal = 'http://192.168.1.6:8080/rest/auth/';
    public header: HttpHeaders = new HttpHeaders();

    // help me i don't have a fuccin clue

    constructor(private http: HttpClient) {
        if (!!localStorage.getItem('auth')) {
            this.header = this.header.set('Authorization', 'Bearer ' + localStorage.getItem('auth'));
        }
    }

    login(username, password) {
        return this.http.post<Login>(this.ipLocal + 'auth/login', {username, password});
    }

    register(email, password, username) {
        return this.http.post<Register>(this.ipLocal + 'auth/register', {email, password, username});
    }

    getPerson() {
        return this.http.get<GetPerson>(this.ipLocal + 'manage/getPerson', {headers: this.header});
    }

    insertData(birthday, weight, height, gender, firstName?, lastName?) {
        console.log(`bday: ${birthday}\nweight: ${weight}\nheight: ${height}\ngender: ${gender}\nfirstname: ${firstName}\nlastName: ${lastName}`);
        return this.http.post<InsertData>(this.ipLocal + 'manage/insertDetails', {
            birthday,
            weight,
            height,
            gender,
            firstName,
            lastName
        }, {headers: this.header});
    }

    updateDetails(birthday, weight, height, gender, firstName?, lastName?) {
        return this.http.post<InsertData>(this.ipLocal + 'manage/updateDetails', {
            birthday,
            weight,
            height,
            gender,
            firstName,
            lastName
        }, {headers: this.header});
    }

    getBeer() {
        return this.http.get<Array<Drink>>(this.ipLocal + 'auth/getBeer', {headers: this.header});
    }

    getWine() {
        return this.http.get<Array<Drink>>(this.ipLocal + 'auth/getWine', {headers: this.header});
    }
}
