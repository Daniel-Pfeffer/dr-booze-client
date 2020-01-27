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
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {ToastController} from '@ionic/angular';
import {throwError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private uri = 'http://vm102.htl-leonding.ac.at:8080/booze/';
    public header: HttpHeaders = new HttpHeaders();
    private hasConnection;

    constructor(
        private http: HttpClient,
        private data: DataService,
        private network: Network,
        private router: Router,
        private toastController: ToastController,
        private s: Storage
    ) {
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
    }

    /**
     * @description register a new user
     * @param username
     * @param email
     * @param password
     * NO OFFLINE SUPPORT
     */
    register(username: string, email: string, password: string) {
        return this.http.post(this.uri + 'auth/register', {
            email,
            password,
            username
        }).pipe(catchError(this.handleError));
    }

    /**
     * @description login a existing user
     * @param username
     * @param password
     * OFFLINE SUPPORT
     */
    login(username: string, password: string) {
        return this.http.post<Login>(this.uri + 'auth/login', {username, password}).pipe(catchError(this.handleError));
    }

    /**
     * @description request a password change
     * @param email
     * NO OFFLINE SUPPORT
     */
    requestPasswordChange(email: string) {
        return this.http.post(this.uri + 'auth/request-password-change', {email}, {observe: 'response'}).pipe(catchError(this.handleError));
    }

    /**
     * @description change the password of a existing user
     * @param pin
     * @param password
     * NO OFFLINE SUPPORT
     */
    changePassword(pin: number, password: string) {
        return this.http.put(this.uri + 'auth/change-password', {
            pin,
            password
        }, {observe: 'response'}).pipe(catchError(this.handleError));
    }

    /**
     * @description get a existing user based on the jwt
     * OFFLINE SUPPORT
     */
    getUser() {
        return this.http.get<User>(this.uri + 'manage/user', {headers: this.header}).pipe(catchError(this.handleError));
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
        }, {headers: this.header}).pipe(catchError(this.handleError));
    }

    /**
     * @description getAlcohols
     * @access Drink Picket
     * @param type
     * OFFLINE SUPPORT
     */
    getAlcohols(type: string) {
        return this.http.get<Array<Alcohol>>(this.uri + `manage/alcohols/${type}`, {headers: this.header}).pipe(catchError(this.handleError));

    }

    /**
     * @description get all favourites server call
     * @param type
     * OFFLINE SUPPORT
     */
    getFavourites(type: string) {
        return this.http.get<Array<Alcohol>>(this.uri + `manage/favourites/${type}`, {headers: this.header}).pipe(catchError(this.handleError));

    }

    /**
     * @description add a new favourite to favourite list
     * @param alcoholId
     * OFFLINE SUPPORT
     */
    addFavourite(alcoholId: number) {
        return this.http.post(this.uri + `manage/favourites/${alcoholId}`, null, {headers: this.header}).pipe(catchError(this.handleError));
    }

    /**
     * @description remove a favourite from to favourite list
     * @param alcoholId
     * OFFLINE SUPPORT
     */
    removeFavourite(alcoholId: number) {
        return this.http.delete(this.uri + `manage/favourites/${alcoholId}`, {headers: this.header}).pipe(catchError(this.handleError));

    }

    /**
     * @description get all drinks the user drank
     * OFFLINE SUPPORT
     */
    getDrinks(count: number) {
        return this.http.get<Array<Drink>>(this.uri + `manage/drinks/${count}`, {headers: this.header}).pipe(catchError(this.handleError));

    }

    /**
     * @description remove a drink from all drinks the user drank
     * @param drinkId
     * OFFLINE SUPPORT
     */
    removeDrink(drinkId: number) {
        return this.http.delete(this.uri + `manage/drinks/${drinkId}`, {headers: this.header}).pipe(catchError(this.handleError));

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
        }, {headers: this.header}).pipe(catchError(this.handleError));
    }

    getPersonalAlcohols(type: string) {
        // TODO: add offline support
        return this.http.get<Array<Alcohol>>(this.uri + `manage/personal-alcohols/${type}`, {headers: this.header}).pipe(catchError(this.handleError));
    }

    addPersonalAlcohol(type: string, name: string, category: string, percentage: number, amount: number) {
        return this.http.post<Alcohol>(this.uri + `manage/personal-alcohols`, {
            type,
            name,
            category,
            percentage,
            amount
        }, {headers: this.header}).pipe(catchError(this.handleError));
    }

    removePersonalAlcohol(alcoholId: number) {
        return this.http.delete(this.uri + `manage/personal-alcohols/${alcoholId}`, {headers: this.header}).pipe(catchError(this.handleError));
    }

    /**
     * @description get the user challenges
     * OFFLINE SUPPORT (blur need internet)
     */
    getChallenges() {
        return this.http.get<Array<Challenge>>(this.uri + 'manage/challenges', {headers: this.header}).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof HttpErrorResponse) {
            if (error.status === 401) {
                this.data.remove(StorageType.AUTH);
                this.data.remove(StorageType.PERSON);
                this.s.clear();
                this.presentToast('Successfully logged out').then(() => this.router.navigate(['login']));
            }
        } else {
            return throwError(
                'Something bad happend :('
            );
        }
    }

    private async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            showCloseButton: true,
            keyboardClose: true
        });
        await toast.present();
    }
}
