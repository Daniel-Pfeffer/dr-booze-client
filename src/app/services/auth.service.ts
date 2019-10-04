/*
Used for all of the authentication
 */
import {Injectable} from '@angular/core';
// Custom time management class
import {GetPerson} from '../interfaces/get-person';
import {DataService} from './data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {


    constructor(private data: DataService) {
    }

    public setToken(token: string, person: GetPerson) {
        this.data.setData('auth', token);
        this.data.setData('person', person);
    }

    public logout() {
        this.data.removeData('auth');
        this.data.removeData('person');
    }

    public isLoggedIn(): boolean {
        return this.data.existsData('auth');
    }
}
