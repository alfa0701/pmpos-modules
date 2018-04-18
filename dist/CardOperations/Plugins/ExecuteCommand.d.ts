import CardOperation from '../CardOperation';
import { CardRecord, ActionRecord } from 'pmpos-models';
export default class ExecuteCommand extends CardOperation {
    constructor();
    canEdit(action: ActionRecord): boolean;
    canApply(card: CardRecord, data: any): boolean;
    readConcurrencyData(card: CardRecord, actionData: any): undefined;
    reduce(card: CardRecord, data: any): CardRecord;
    fixData(data: any): any;
    processPendingAction(action: ActionRecord): ActionRecord;
}
