import {CustomError} from '../interfaces/error';

export class SwitchError {
    public switcher(error: CustomError) {
        switch (error.error_code) {
            case 601:
                return error.error_reason + ' can´t be empty\n';
            case 602:
                return error.error_reason + ' is already taken\n';
            case 603: /* Todo: extend tree for size
                 *  error_codes on discord
                 *  add all size options
                */
                return error.error_reason + 's size isn´t correct\n';
            case 604:
                return error.error_reason + ' is invalid\n';
            case 605:
                return 'Invalid Username or password\n';
            case 606:
                return 'Email sending failed\n';
            case 607:
                return 'User not found\n';
            case 699:
                return 'Some other error occurred';
            default:
                return 'Sorry what';
        }
    }
}
