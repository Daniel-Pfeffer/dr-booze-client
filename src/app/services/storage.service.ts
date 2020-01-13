import {Injectable} from '@angular/core';
import * as Cookies from 'js-cookie';
import {DataService} from './data.service';
import {StorageCommand} from '../data/enums/StorageCommand';
import {StorageType} from '../data/enums/StorageType';
import Dexie from 'dexie';

@Injectable({
    providedIn: 'root'
})
/**
 * @description long-term storage which stores auth tokens secure
 * @author Daniel Pfeffer
 */
export class StorageService {

    constructor(
        private d: DataService
    ) {
        const {Remove, Load, Insert} = StorageCommand;
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
        if (key === AUTH) {
            console.log('cookie auth set');
            Cookies.set(key, value, {sameSite: 'Strict', expires: 7});
        }
    }

    public get(key: StorageType): any {
        const {AUTH} = StorageType;
        if (key === AUTH) {
            return Cookies.get(key);
        }
    }

    private remove(key: StorageType) {
        const {AUTH} = StorageType;
        if (key === AUTH) {
            Cookies.remove(key);
        }
    }

    public load(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.d.set(StorageType.AUTH, Cookies.get('auth'));
            resolve(true);
        });
    }
}
