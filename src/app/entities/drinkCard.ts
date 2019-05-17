import {DrinkType} from '../interfaces/drink';

export class DrinkCard {
    constructor(public type: DrinkType,
                public title: string,
                public iconName: string,
                public iconMode: string) {
    }
}
