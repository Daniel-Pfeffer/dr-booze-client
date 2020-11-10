import {StorageCommand} from '../enums/StorageCommand';
import {StorageType} from '../enums/StorageType';

export interface ToStore {
    command: StorageCommand;
    row?: StorageType;
    value?: string;
}
