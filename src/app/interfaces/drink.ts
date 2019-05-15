import {Moment} from 'moment';

export interface Drink {
    // drinkID only important for server
    drinkID: number;
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

enum DrinkType {
    BEER,
    WINE
}
