import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Login} from '../interfaces/login';
import {Drink} from '../entities/drink';
import {Challenge} from '../interfaces/challenge';
import {User} from '../entities/user';
import {Alcohol} from '../entities/alcohol';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private uri = 'http://localhost:8080/booze/';
    public header: HttpHeaders = new HttpHeaders();

    constructor(private http: HttpClient) {
        if (!!localStorage.getItem('auth')) {
            this.header = this.header.set('Authorization', 'Bearer ' + localStorage.getItem('auth'));
        }
    }

    register(username: string, email: string, password: string) {
        return this.http.post(this.uri + 'auth/register', {email, password, username});
    }

    login(username: string, password: string) {
        return this.http.post<Login>(this.uri + 'auth/login', {username, password});
    }

    requestPasswordChange(email: string) {
        return this.http.post(this.uri + 'auth/request-password-change', {email}, {observe: 'response'});
    }

    changePassword(pin: number, password: string) {
        return this.http.post(this.uri + 'auth/change-password', {
            pin,
            password
        }, {observe: 'response'});
    }

    getUser() {
        return this.http.get<User>(this.uri + 'manage/user', {headers: this.header});
    }

    insertDetails(gender: string, birthday: string, height: number,
                  weight: number, firstName?: string, lastName?: string) {
        return this.http.post<User>(this.uri + 'manage/details', {
            firstName,
            lastName,
            gender,
            birthday,
            weight,
            height
        }, {headers: this.header});
    }

    updateDetails(gender: string, birthday: string, height: number,
                  weight: number, username?: string, firstName?: string, lastName?: string) {
        return this.http.put<User>(this.uri + 'manage/details', {
            username,
            firstName,
            lastName,
            gender,
            birthday,
            weight,
            height
        }, {headers: this.header});
    }

    getAlcohols(type: string) {
        return this.http.get<Array<Alcohol>>(this.uri + `manage/alcohols/${type}`, {headers: this.header});
    }

    getDrinks() {
        return this.http.get<Array<Drink>>(this.uri + 'manage/drinks', {headers: this.header});
    }

    addDrink(alcoholId: number, drankDate: string, longitude: number, latitude: number) {
        return this.http.post(this.uri + 'manage/drinks', {
            alcoholId,
            drankDate,
            longitude,
            latitude
        }, {headers: this.header});
    }

    getChallenges() {
        return this.http.get<Array<Challenge>>(this.uri + 'manage/challenges', {headers: this.header});
    }
}
