import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {User} from '../entities/user';

/*
    Used for all of the authentication
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private data: DataService) {
    }

    public setToken(token: string) {
        this.data.setData('auth', token);
    }

    public setUser(user: User) {
        this.data.setData('user', user);
    }

    public logout() {
        this.data.removeData('auth');
        this.data.removeData('user');
    }

    public isLoggedIn(): boolean {
        return this.data.existsData('auth');
    }
}
