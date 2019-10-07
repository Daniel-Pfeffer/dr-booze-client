import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private data = {};

    setData(name, value) {
        this.data[name] = value;
    }

    getData(name): any {
        if (this.existsData(name)) {
            return this.data[name];
        } else {
            throw new Error('Data doesn\'t exist');
        }
    }

    existsData(name): boolean {
        return !!this.data[name];
    }

    removeData(name): void {
        if (this.existsData(name)) {
            delete this.data[name];
        } else {
            throw new Error('Data doesn\'t exist');
        }
    }
}
