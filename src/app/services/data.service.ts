import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {Observable, Subject} from 'rxjs';
import {ToStore} from '../interfaces/toStore';

@Injectable({
    providedIn: 'root'
})
/**
 * @description short-term/session storage
 * @author Daniel Pfeffer
 */
export class DataService {

    public observable: Observable<ToStore>;
    private subject: Subject<ToStore>;
    private data = {};

    constructor() {
        this.subject = new Subject<ToStore>();
        this.observable = this.subject.asObservable();
    }


    /**
     * @description sets data into the st-storage
     * @param key name of the storage key
     * @param value value of the storage
     */
    set(key, value) {
        this.data[key] = value;
        if (key === 'auth') {
            this.subject.next({row: key, value: value});
        }
    }

    /**
     * @description Receives data from the st-storage if the type doesn't exist and it is auth get it from the lt-storage
     * @param key name of the storage key
     * @return Any
     */
    get(key): any {
        if (this.exist(key)) {
            return this.data[key];
        } else {
            throw new Error('Data doesn\'t exist');
        }
    }

    /**
     * @description Checks if key name exists in st-storage
     * @param key name of the storage key
     */
    exist = (key): boolean => !!this.data[key];

    /**
     * deletes data from the st-storage if the key is auth also delete from lt-storage
     * @param key name of the storage key
     */
    remove(key): void {
        if (this.exist(key)) {
            delete this.data[key];
        } else {
            throw new Error('Data doesn\'t exist');
        }
    }
}
