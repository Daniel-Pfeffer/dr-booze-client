import {CustomError} from './error';
import {User} from '../entities/user';
import {Person} from '../entities/person';

/*
    all variables which ends in a ? are variables which can
    be but don't need to be in the Json gathered from the server

    worked just displays if the login was successful
    userToken is the token which identifies the user
    expiresAt is the time when the userToken expires
    errors is an array of custom errors
 */
export interface Login {
    error?: CustomError;
    token?: string;
}
