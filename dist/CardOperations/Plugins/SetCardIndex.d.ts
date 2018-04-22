import CardOperation from '../CardOperation';
import { CardRecord, ActionRecord } from 'pmpos-models';
export default class SetCardTag extends CardOperation {
    constructor();
    canEdit(action: ActionRecord): boolean;
    readConcurrencyData(card: CardRecord, data: any): undefined;
    reduce(card: CardRecord, data: any): CardRecord;
    fixData(data: any): any;
    canApply(card: CardRecord, data: any): boolean;
    processPendingAction(action: ActionRecord): ActionRecord;
}
