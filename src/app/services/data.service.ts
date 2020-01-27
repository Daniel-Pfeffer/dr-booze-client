import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ToStore} from '../data/interfaces/toStore';
import {StorageCommand} from '../data/enums/StorageCommand';
import {StorageType} from '../data/enums/StorageType';

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
     * @param isLoad when loaded from the ns
     */
    set(key: StorageType, value: any, isLoad?: boolean) {
        const {Insert} = StorageCommand;
        this.data[key] = value;
        if (!isLoad) {
            this.subject.next({command: Insert, row: key, value: value});
        }
    }

    /**
     * @description Receives data from the st-storage if the type doesn't exist and it is auth get it from the lt-storage
     * @param key name of the storage key
     * @return Any
     */
    get(key: StorageType): any {
        if (this.exist(key)) {
            return this.data[key];
        } else {
            return null;
        }
    }

    /**
     * @description Checks if key name exists in st-storage
     * @param key name of the storage key
     */
    exist = (key: StorageType): boolean => !!this.data[key];

    /**
     * deletes data from the st-storage if the key is auth
     * @param key name of the storage key
     */
    remove(key: StorageType): void {
        const {Remove} = StorageCommand;
        if (this.exist(key)) {
            delete this.data[key];
            this.subject.next({command: Remove, row: key});
        } else {
        }
    }
}
