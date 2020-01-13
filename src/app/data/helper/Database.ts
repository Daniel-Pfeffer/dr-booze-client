import Dexie from 'dexie';
import {AlcoholType} from '../enums/AlcoholType';
import {Alcohol, Alcohol as Alc} from '../entities/alcohol';
import {Drink} from '../entities/drink';
import {User} from '../entities/user';

export class Database extends Dexie {
    alcohol: Dexie.Table<DBAlcohol, number>;
    drink: Dexie.Table<DBDrink, number>;
    person: Dexie.Table<DBPerson, number>;
    perMille: Dexie.Table<DBPerMille, number>;

    constructor() {
        super('DrBooze');

        this.version(1).stores({
            alcohol: '++id, type, name, percentage, amount, category, isFavourite',
            drink: '++id, alcohol, drankDate, longitude, latitude',
            person: '++id, username, firstName, lastName, gender, birthday, height, weight, gkw',
            perMille: '++id, value, checkedOn'
        });

        this.alcohol = this.table('alcohol');
        this.drink = this.table('drink');
        this.person = this.table('person');
        this.perMille = this.table('perMille');
    }

    public getFavourites(type: AlcoholType): Promise<DBAlcohol[]> {
        return this.alcohol.where(['isFavourite', 'type'])
            .equals([1, type])
            .toArray(value => {
                return value;
            });
    }

    public addFavourite(alcoholId: number): Promise<number> {
        return this.alcohol
            .update(alcoholId, {isFavourite: 1});
    }

    public removeFavourite(alcoholId: number): Promise<number> {
        return this.alcohol.update(alcoholId, {isFavourite: 0});
    }

    public getDrinks(): Promise<DBDrink[]> {
        return this.drink.toArray();
    }

    public removeDrink(drinkId: number): Promise<void> {
        return this.drink.delete(drinkId);
    }

    public addDrink(drink: Drink) {
        const existingDrink: DBDrink = drink;
        return this.drink.add(existingDrink);
    }

    public getAlcohols(type: string) {
        return this.alcohol.where([type]).equals([type]).toArray();
    }

    public getUser() {
        return this.person.toArray();
    }

    public bulkAddAlcohols(alcohols: Array<Alcohol>) {
        return this.alcohol.bulkAdd(alcohols);
    }


    public addUser(user: User) {
        // tslint:disable-next-line:prefer-const
        let dbUser: DBPerson;
        dbUser.id = 1;
        Object.assign(dbUser, user);
        return this.person.add(dbUser);
    }
}


interface DBAlcohol {
    id: number;
    type: AlcoholType;
    name: string;
    percentage: number;
    amount: number;
    category: string;
    isFavourite?: boolean;
}

interface DBDrink {
    id: number;
    alcohol: DBAlcohol;
    drankDate: number;
    longitude: number;
    latitude: number;
}

interface DBPerson {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    gender: string;
    birthday: number;
    height: number;
    weight: number;
    gkw: number;
}

interface DBPerMille {
    id: number;
    value: number;
    checkedOn: number;
}
