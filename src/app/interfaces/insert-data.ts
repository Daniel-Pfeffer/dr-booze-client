import {Person} from '../entities/person';
import {User} from '../entities/user';
import {CustomError} from './error';

export interface InsertData {
    person?: Person;
    user?: User;
    error?: CustomError;
}
