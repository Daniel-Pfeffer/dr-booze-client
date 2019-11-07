import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Login} from '../data/interfaces/login';
import {Drink} from '../data/entities/drink';
import {Challenge} from '../data/interfaces/challenge';
import {User} from '../data/entities/user';
import {Alcohol} from '../data/entities/alcohol';
import {DataService} from './data.service';
import {StorageType} from '../data/enums/StorageType';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private uri = 'http://localhost:8080/booze/';
    public header: HttpHeaders = new HttpHeaders();

    constructor(private http: HttpClient, private data: DataService) {
        if (data.exist(StorageType.Auth)) {
            this.header = this.header.set('Authorization', 'Bearer ' + data.get(StorageType.Auth));
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

    setDetails(gender: string, birthday: number, height: number,
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

    // Drink Picker
    getAlcohols(type: string) {
        return this.http.get<Array<Alcohol>>(this.uri + `manage/alcohols/${type}`, {headers: this.header});
    }

    getFavourites(type: string) {
        return this.http.get<Array<Alcohol>>(this.uri + `manage/favourites/${type}`, {headers: this.header});
    }

    addFavourite(alcoholId: number) {
        return this.http.post(this.uri + `manage/favourites/${alcoholId}`, null, {headers: this.header});
    }

    removeFavourite(alcoholId: number) {
        return this.http.delete(this.uri + `manage/favourites/${alcoholId}`, {headers: this.header});
    }

    getDrinks() {
        return this.http.get<Array<Drink>>(this.uri + 'manage/drinks', {headers: this.header});
    }

    removeDrink(drinkId: number) {
        return this.http.delete(this.uri + `manage/drinks/${drinkId}`, {headers: this.header});
    }

    addDrink(alcoholId: number, drankDate: number, longitude: number, latitude: number) {
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
