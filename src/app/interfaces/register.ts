import {CustomError} from './error';
import {User} from '../entities/user';
/*
    errors is a array of custom errors
    user is just for safeness that the request was successful
 */
export interface Register {
    error?: Array<CustomError>;
    user?: User;
}
