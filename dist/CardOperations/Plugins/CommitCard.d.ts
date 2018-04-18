import CardOperation from '../CardOperation';
import { ActionRecord, CardRecord } from 'pmpos-models';
export default class CommitCard extends CardOperation {
    constructor();
    canEdit(action: ActionRecord): boolean;
    canApply(card: CardRecord, data: any): boolean;
    readConcurrencyData(card: CardRecord, actionData: any): undefined;
    reduce(card: CardRecord, data: any): CardRecord;
    fixData(data: any): any;
    processPendingAction(action: ActionRecord): ActionRecord;
}
