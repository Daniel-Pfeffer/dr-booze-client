import {Person} from '../entities/person';
import {CustomError} from './error';

export interface GetPerson {
    person?: Person;
    error?: CustomError;
}
