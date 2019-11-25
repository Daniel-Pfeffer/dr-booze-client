import {Injectable} from '@angular/core';
import * as Cookies from 'js-cookie';
import {DataService} from './data.service';
import {SecureStorage} from '@ionic-native/secure-storage/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {StorageCommand} from '../data/enums/StorageCommand';
import {StorageType} from '../data/enums/StorageType';

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
        const {AUTH} = StorageType;
        if (this.isBrowser) {
            if (key === AUTH) {
                console.log('cookie auth set');
                Cookies.set(key, value, {sameSite: 'Strict', expires: 7});
            } else {
                if (typeof value === 'object') {
                    localStorage.setItem(key.toString(), JSON.stringify(value));
                } else {
                    localStorage.setItem(key.toString(), value);
                }
            }
        } else {
            if (key === AUTH) {
                this.ss.create('drBoozeSecure').then(ssInstance => {
                    ssInstance.set(key, value).then(() => {
                        console.log('Set secure');
                    });
                });
            } else {
                this.ns.setItem(key.toString(), value).then(() => {
                    console.log(`Set nonsecure value ${key}`);
                });
            }
        }
    }

    public get(key: StorageType): any {
        const {AUTH} = StorageType;
        if (this.isBrowser) {
            if (key === AUTH) {
                return Cookies.get(key);
            } else {
                let returnVal;
                try {
                    returnVal = JSON.parse(localStorage.getItem(key.toString()));
                } catch (e) {
                    returnVal = localStorage.getItem(key.toString());
                }
                return returnVal;
            }
        } else {
            if (key === AUTH) {
                this.ss.create('drBoozeSecure').then(ssInstance => {
                    ssInstance.get(key).then(authToken => {
                        return authToken;
                    });
                });
            } else {
                this.ns.getItem(key.toString()).then(value => {
                    return value;
                });
            }
        }
    }

    private remove(key: StorageType) {
        const {AUTH} = StorageType;
        if (this.isBrowser) {
            if (key === AUTH) {
                Cookies.remove(key);
            } else {
                localStorage.removeItem(key.toString());
            }
        } else {
            if (key === AUTH) {
                this.ss.create('drBoozeSecure').then(ssInstance => {
                    ssInstance.remove(key).then(removed => {
                        console.log(`removed ${key}`);
                    });
                });
            } else {
                this.ns.remove(key.toString()).then(removed => {
                    console.log(`removed ${key}`);
                });
            }
        }
    }

    public load(): Promise<boolean> {
        console.log('called log');
        return new Promise<boolean>(resolve => {
            if (this.isBrowser) {
                this.d.set(StorageType.AUTH, Cookies.get('auth'));
                Object.entries(localStorage).forEach(value => {
                    console.log('key: ' + value);
                    try {
                        this.d.set(StorageType[value[0].toUpperCase()], JSON.parse(value[1]), true);
                    } catch (e) {
                        this.d.set(StorageType[value[0].toUpperCase()], value[1], true);
                    }
                });
            } else {
                this.ss.create('drBoozeSecure').then(ssInstance => {
                    ssInstance.get(StorageType.AUTH).then(value => {
                        this.d.set(StorageType.AUTH, value, true);
                    });
                });
                this.ns.keys().then(value => {
                    // tslint:disable-next-line:forin
                    for (const key in value) {
                        this.d.set(StorageType[key], value, true);
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
