import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Login} from '../interfaces/login';
import {Drink} from '../interfaces/drink';
import {Challenge} from '../interfaces/challenge';
import {User} from '../entities/user';

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

    addDrink(id, type, unixTime, longitude, latitude) {
        console.log('addDrink: longitude ' + longitude + ' latitude: ' + latitude);
        return this.http.post(this.uri + 'manage/addDrink', {
                id,
                type,
                unixTime,
                longitude,
                latitude
            },
            {headers: this.header});
    }

    requestPasswordChange(email) {
        return this.http.post(this.uri + 'auth/requestPasswordChange',
            {email},
            {observe: 'response'});
    }

    updatePassword(password, pin) {
        return this.http.post(this.uri + 'auth/updatePassword',
            {password, pin},
            {observe: 'response'});
    }

    getDrinks() {
        return this.http.get<Array<Drink>>(this.uri + 'manage/getDrinks', {headers: this.header});
    }

    getBeer() {
        return this.http.get<Array<Drink>>(this.uri + 'getter/getBeer', {headers: this.header});
    }

    getWine() {
        return this.http.get<Array<Drink>>(this.uri + 'getter/getWine', {headers: this.header});
    }

    getCocktails() {
        return this.http.get<Array<Drink>>(this.uri + 'getter/getCocktails', {headers: this.header});
    }

    getLiquor() {
        return this.http.get<Array<Drink>>(this.uri + 'getter/getLiquor', {headers: this.header});
    }

    getChallenges() {
        return this.http.get<Array<Challenge>>(this.uri + 'manage/manageChallenges', {headers: this.header});
    }
}
