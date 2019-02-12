import {Dialogs, DialogsPromptCallback} from '@ionic-native/dialogs/ngx';

export class DialogDisplay {
    public displayAlert(message: string, title?: string, buttonlabel?: string): Promise<any> {
        return this.dialog.alert(message, title, buttonlabel);
    }

    public displayPromis(message: string, title?: string, buttonlabel?: string[]): Promise<DialogsPromptCallback> {
        return this.dialog.prompt(message, title, buttonlabel);
    }

    public displayConfirm(message: string, title?: string, buttonlabel?: string[]): Promise<number> {
        return this.dialog.confirm(message, title, buttonlabel);
    }

    constructor(private dialog: Dialogs) {
    }
}
