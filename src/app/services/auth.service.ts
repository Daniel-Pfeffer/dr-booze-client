/*
Used for all of the authentication
 */
import {Injectable} from '@angular/core';
// Custom time management class
import {GetPerson} from '../interfaces/get-person';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor() {
    }

    public static setToken(token: string, person: GetPerson) {
        localStorage.setItem('auth', token);
        localStorage.setItem('person', JSON.stringify(person));
    }

    public static logout() {
        localStorage.removeItem('auth');
        localStorage.removeItem('person');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('auth');
    }
}
