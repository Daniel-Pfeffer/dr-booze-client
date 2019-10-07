export class Alcohol {
    id: number;
    type: AlcoholType;
    name: String;
    percentage: number;
    amount: number;
}

export enum AlcoholType {
    BEER,
    WINE,
    LIQUOR,
    COCKTAIL
}
