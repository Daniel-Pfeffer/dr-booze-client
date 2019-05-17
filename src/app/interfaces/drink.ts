import {Moment} from 'moment';

export interface Drink {
    // id only important for server
    id: number;
    // drink name just for displaying
    name: string;
    // amount user drank in ml
    amount: number;
    // percentage of the drink in %
    percentage: number;
    // time when drink was consumed in unix time
    timeWhenDrank: Moment;
    // bak due to alcohol
    bak: number;
    // drinkType
    drinkType: DrinkType;
    // longitude of the drink position
    longitude: number;
    // latitude of the drink position
    latitude: number;
}

export enum DrinkType {
    BEER,
    WINE,
    COCKTAIL,
    LIQUOR,
    OTHER
}
