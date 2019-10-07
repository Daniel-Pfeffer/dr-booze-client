import {Moment} from 'moment';
import {Alcohol} from './alcohol';

export class Drink {
    alcohol: Alcohol;
    drankDate: Moment;
    longitude: number;
    latitude: number;
}
