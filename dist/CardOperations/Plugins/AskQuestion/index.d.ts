import CardOperation from '../../CardOperation';
import { ActionRecord, CardRecord } from 'pmpos-models';
export default class AskQuestion extends CardOperation {
    constructor();
    canEdit(action: ActionRecord): boolean;
    createEditor(card: CardRecord, success: (actionType: string, data: any) => void, cancel: () => void, current: any): any;
    canApply(card: CardRecord, data: any): boolean;
    readConcurrencyData(card: CardRecord, actionData: any): undefined;
    reduce(card: CardRecord, data: any): CardRecord;
    fixData(data: any): any;
    processPendingAction(action: ActionRecord): ActionRecord;
}
