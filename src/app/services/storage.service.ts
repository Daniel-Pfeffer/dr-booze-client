import {Injectable} from '@angular/core';
import * as Cookies from 'js-cookie';
import {DataService} from './data.service';
import {SecureStorage} from '@ionic-native/secure-storage/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {StorageCommand} from '../data/enums/StorageCommand';
import {StorageType} from '../data/enums/StorageType';
import {logger} from 'codelyzer/util/logger';

@Injectable({
    providedIn: 'root'
})
/**
 * @description long-term storage which stores auth tokens secure
 * @author Daniel Pfeffer
 */
export class StorageService {

    private readonly isBrowser: boolean;
    // MARK: Constructor
    constructor(
        private d: DataService,
        private ss: SecureStorage,
        private ns: NativeStorage
    ) {
        const {Remove, Load, Insert} = StorageCommand;
        if (window.cordova) {
            if (window.cordova.platformId === 'browser') {
                console.log('on browser');
                this.isBrowser = true;
            } else {
                this.isBrowser = false;
            }
        } else {
            this.isBrowser = true;
        }
        d.observable.subscribe(item => {
            if (item.command === Remove) {
                this.remove(item.row);
            } else if (item.command === Load) {
            } else if (item.command === Insert) {
                this.set(item.row, item.value);
            }
        });
    }

    private set(key: StorageType, value: any) {
        const {Auth} = StorageType;
        if (this.isBrowser) {
            if (key === Auth) {
                console.log('cookie auth set');
                Cookies.set(key, value, {sameSite: 'Strict', expires: 7});
            } else {
                if (typeof value === 'object') {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    localStorage.setItem(key, value);
                }
            }
        } else {
            if (key === Auth) {
                this.ss.create('drBoozeSecure').then(ssInstance => {
                    ssInstance.set(key, value).then(() => {
                        console.log('Set secure');
                    });
                });
            } else {
                this.ns.setItem(key, value).then(() => {
                    console.log(`Set nonsecure value ${key}`);
                });
            }
        }
    }

    public get(key: StorageType): any {
        const {Auth} = StorageType;
        if (this.isBrowser) {
            if (key === Auth) {
                return Cookies.get(key);
            } else {
                let returnVal;
                try {
                    returnVal = JSON.parse(localStorage.getItem(key));
                } catch (e) {
                    returnVal = localStorage.getItem(key);
                }
                return returnVal;
            }
        } else {
            if (key === Auth) {
                this.ss.create('drBoozeSecure').then(ssInstance => {
                    ssInstance.get(key).then(authToken => {
                        return authToken;
                    });
                });
            } else {
                this.ns.getItem(key).then(value => {
                    return value;
                });
            }
        }
    }

    private remove(key: StorageType) {
        const {Auth} = StorageType;
        if (this.isBrowser) {
            if (key === Auth) {
                Cookies.remove(key);
            } else {
                localStorage.removeItem(key);
            }
        } else {
            if (key === Auth) {
                this.ss.create('drBoozeSecure').then(ssInstance => {
                    ssInstance.remove(key).then(removed => {
                        console.log(`removed ${key}`);
                    });
                });
            } else {
                this.ns.remove(key).then(removed => {
                    console.log(`removed ${key}`);
                });
            }
        }
    }

    public load(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            if (this.isBrowser) {
                this.d.set(StorageType.Auth, Cookies.get('auth'));
                Object.entries(localStorage).forEach(value => {
                    this.d.set(StorageType[value[0]], value[1]);
                });
            } else {
                this.ss.create('drBoozeSecure').then(ssInstance => {
                    ssInstance.get(StorageType.Auth).then(value => {
                        this.d.set(StorageType.Auth, value);
                    });
                });
                this.ns.keys().then(value => {
                    // tslint:disable-next-line:forin
                    for (const key in value) {
                        this.ns.getItem(key).then(value1 => {
                            this.d.set(StorageType[key], value);
                        });
                    }
                });
            }
            resolve(true);
        });
    }

    public getNs() {
        if (!this.isBrowser) {
            console.log('access ns');
            this.ns.keys().then(value => {
                console.log(value);
            });
        } else {
            console.log('access ls');
        }
    }
}
