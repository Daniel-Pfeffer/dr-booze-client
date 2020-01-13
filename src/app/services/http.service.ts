import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Login} from '../data/interfaces/login';
import {Drink} from '../data/entities/drink';
import {Challenge} from '../data/interfaces/challenge';
import {User} from '../data/entities/user';
import {Alcohol} from '../data/entities/alcohol';
import {DataService} from './data.service';
import {StorageType} from '../data/enums/StorageType';
import {Network} from '@ionic-native/network/ngx';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private uri = 'http://172.17.208.22:8080/booze/';
    public header: HttpHeaders = new HttpHeaders();
    private hasConnection;

    constructor(private http: HttpClient, private data: DataService, private network: Network) {
        console.log('network: ', this.network);
        this.hasConnection = !(
            this.network.type === network.Connection.NONE
            || this.network.type === network.Connection.CELL
            || this.network.type === network.Connection.CELL_2G
        );
        if (data.exist(StorageType.AUTH)) {
            this.header = this.header.set('Authorization', 'Bearer ' + data.get(StorageType.AUTH));
        }
        this.network.onChange().subscribe(item => {
            this.hasConnection = item.type === 'online';
        });
        console.log(this.hasConnection);
    }

    /**
     * @description register a new user
     * @param username
     * @param email
     * @param password
     * NO OFFLINE SUPPORT
     */
    register(username: string, email: string, password: string) {
        return this.http.post(this.uri + 'auth/register', {email, password, username});
    }

    /**
     * @description login a existing user
     * @param username
     * @param password
     * OFFLINE SUPPORT
     */
    login(username: string, password: string) {
        return this.http.post<Login>(this.uri + 'auth/login', {username, password});
    }

    /**
     * @description request a password change
     * @param email
     * NO OFFLINE SUPPORT
     */
    requestPasswordChange(email: string) {
        return this.http.post(this.uri + 'auth/request-password-change', {email}, {observe: 'response'});
    }

    /**
     * @description change the password of a existing user
     * @param pin
     * @param password
     * NO OFFLINE SUPPORT
     */
    changePassword(pin: number, password: string) {
        return this.http.post(this.uri + 'auth/change-password', {
            pin,
            password
        }, {observe: 'response'});
    }

    /**
     * @description get a existing user based on the jwt
     * OFFLINE SUPPORT
     */
    getUser() {
        return this.http.get<User>(this.uri + 'manage/user', {headers: this.header});
    }

    /**
     * @description set the
     * @param gender
     * @param birthday
     * @param height
     * @param weight
     * @param firstName
     * @param lastName
     * OFFLINE SUPPORT
     */
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

    /**
     * @description getAlcohols
     * @access Drink Picket
     * @param type
     * OFFLINE SUPPORT
     */
    getAlcohols(type: string) {
        return this.http.get<Array<Alcohol>>(this.uri + `manage/alcohols/${type}`, {headers: this.header});

    }

    /**
     * @description get all favourites server call
     * @param type
     * OFFLINE SUPPORT
     */
    getFavourites(type: string) {
        return this.http.get<Array<Alcohol>>(this.uri + `manage/favourites/${type}`, {headers: this.header});

    }

    /**
     * @description add a new favourite to favourite list
     * @param alcoholId
     * OFFLINE SUPPORT
     */
    addFavourite(alcoholId: number) {
        return this.http.post(this.uri + `manage/favourites/${alcoholId}`, null, {headers: this.header});
    }

    /**
     * @description remove a favourite from to favourite list
     * @param alcoholId
     * OFFLINE SUPPORT
     */
    removeFavourite(alcoholId: number) {
        return this.http.delete(this.uri + `manage/favourites/${alcoholId}`, {headers: this.header});

    }

    /**
     * @description get all drinks the user drank
     * OFFLINE SUPPORT
     */
    getDrinks() {
        return this.http.get<Array<Drink>>(this.uri + 'manage/drinks', {headers: this.header});

    }

    /**
     * @description remove a drink from all drinks the user drank
     * @param drinkId
     * OFFLINE SUPPORT
     */
    removeDrink(drinkId: number) {
        return this.http.delete(this.uri + `manage/drinks/${drinkId}`, {headers: this.header});

    }

    /**
     * @description add a drink to all drinks the user drank
     * OFFLINE SUPPORT
     * @param drink
     */
    addDrink(drink: Drink) {
        const {DRINKS} = StorageType;
        const drinks = this.data.exist(DRINKS) ? this.data.get(DRINKS) : new Array<Drink>();
        drinks.push(drink);
        this.data.set(DRINKS, drinks);
        const {drankDate, latitude, longitude} = drink;
        const alcoholId = drink.alcohol.id;
        return this.http.post(this.uri + 'manage/drinks', {
            alcoholId,
            drankDate,
            longitude,
            latitude
        }, {headers: this.header});
    }

    getPersonalAlcohols(type: string) {
        // TODO: add offline support
        return this.http.get<Array<Alcohol>>(this.uri + `manage/personal-alcohols/${type}`, {headers: this.header});
    }

    addPersonalAlcohol(type: string, name: string, category: string, percentage: number, amount: number) {
        return this.http.post<Alcohol>(this.uri + `manage/personal-alcohols`, {
            type,
            name,
            category,
            percentage,
            amount
        }, {headers: this.header});
    }

    removePersonalAlcohol(alcoholId: number) {
        return this.http.delete(this.uri + `manage/personal-alcohols/${alcoholId}`, {headers: this.header});
    }

    /**
     * @description get the user challenges
     * OFFLINE SUPPORT (blur need internet)
     */
    getChallenges() {
        return this.http.get<Array<Challenge>>(this.uri + 'manage/challenges', {headers: this.header});
    }
}
