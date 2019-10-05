import {AlcoholType} from './alcohol';

export class DrinkCard {
    constructor(public type: AlcoholType,
                public title: string,
                public iconName: string,
                public iconMode: string) {
    }
}
