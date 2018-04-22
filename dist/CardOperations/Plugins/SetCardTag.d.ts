import CardOperation from '../CardOperation';
import { ActionRecord, CardRecord, CardTagRecord } from 'pmpos-models';
export default class SetCardTag extends CardOperation {
    constructor();
    canEdit(action: ActionRecord): boolean;
    readConcurrencyData(card: CardRecord, data: CardTagRecord): any;
    private tagValueRemoved(card, data);
    private tagAmountRemoved(card, data);
    reduce(card: CardRecord, data: CardTagRecord): CardRecord;
    canReduceCard(card: CardRecord, action: ActionRecord): boolean;
    fixData(data: any): any;
    valueNeeded(data: any, currentValue: CardTagRecord): boolean;
    amountNeeded(data: any, currentValue: CardTagRecord): boolean;
    valueChanged(currentValue: CardTagRecord, data: any): boolean;
    canApply(card: CardRecord, data: any): boolean;
    processPendingAction(action: ActionRecord): ActionRecord;
}
