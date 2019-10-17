import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import * as Cookies from 'js-cookie';
import {DataService} from './data.service';
import {SecureStorage, SecureStorageObject} from '@ionic-native/secure-storage/ngx';
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
    private ssInstance: SecureStorageObject;

    constructor(private p: Platform, private d: DataService, private ss: SecureStorage, private ns: NativeStorage) {
        const {Remove, Load, Insert} = StorageCommand;
        if (window.cordova) {
            if (window.cordova.platformId === 'browser') {
                console.log('on browser');
                this.isBrowser = true;
            } else {
                this.isBrowser = false;
                ss.create('drBoozeSecure').then(value => {
                    this.ssInstance = value;
                });
            }
        } else {
            this.isBrowser = true;
        }
        d.observable.subscribe(item => {
            if (item.command === Remove) {
                this.remove(item.row);
            } else if (item.command === Load) {
                // TODO: load into dataService
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
                this.ssInstance.set(key, value).then(value1 => {
                    console.log(value1);
                });
            } else {
                this.ns.setItem(key, value);
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
                this.ssInstance.get(key).then(value => {
                    console.log(value);
                }).catch(reason => console.log(reason));
            } else {
                this.ns.getItem(key);
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
                this.ssInstance.remove(key);
            } else {
                this.ns.remove(key);
            }
        }
    }

    private load() {
        if (this.isBrowser) {
            this.d.set(StorageType.Auth, Cookies.get('auth'));
        }
    }
}
