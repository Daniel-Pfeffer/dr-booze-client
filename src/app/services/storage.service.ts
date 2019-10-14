import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import * as Cookies from 'js-cookie';
import {DataService} from './data.service';

@Injectable({
    providedIn: 'root'
})
/**
 * @description long-term storage which stores auth tokens secure
 * @author Daniel Pfeffer
 */
export class StorageService {

    // TODO: check on iphone/android if that would work
    private readonly isBrowser: boolean;

    constructor(private p: Platform, private d: DataService) {
        if (p.is('cordova')) {
            console.log('on browser');
            this.isBrowser = true;
        } else {
            this.isBrowser = false;
        }
        d.observable.subscribe(item => {
        });
    }

    public set(key, value) {
        if (this.isBrowser) {
            if (key === 'auth') {
                console.log('cookie auth set');
                Cookies.set('auth', value, {sameSite: 'Strict', expires: 7});
            } else {
                if (typeof value === 'object') {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    localStorage.setItem(key, value);
                }
            }
        } else {
            if (key === 'auth') {
                // TODO: Store in ass (ref: RoarFit)
            } else {
                // TODO: Store in SQLite DB
            }
        }
    }

    public get(key): any {
        if (this.isBrowser) {
            if (key === 'auth') {
                return Cookies.get('auth');
            } else {
                // TODO: get from LS
            }
        } else {
            if (key === 'auth') {
                // TODO: get from ass (ref: RoarFit)
            } else {
                // TODO: get from SQLite DB
            }
        }
    }

    public remove(key) {
        if (this.isBrowser) {
            if (key === 'auth') {
                Cookies.remove('auth');
            } else {
                localStorage.removeItem(key);
            }
        } else {
            if (key === 'auth') {
                // TODO: remove from ass (ref: RoarFit)
            } else {
                // TODO: remove from SQLite DB
            }
        }
    }
}
