import {AlcoholType} from '../enums/AlcoholType';

export class Alcohol {
    id: number;
    type: AlcoholType;
    name: String;
    percentage: number;
    amount: number;
    category: string;
    isPersonal: boolean;
}
