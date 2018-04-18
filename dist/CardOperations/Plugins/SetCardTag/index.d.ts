import * as React from 'react';
import CardOperation from '../../CardOperation';
import { ActionRecord, CardRecord, CardTagRecord, TagTypeRecord } from 'pmpos-models';
export default class SetCardTag extends CardOperation {
    constructor();
    canEdit(action: ActionRecord): boolean;
    createEditor(card: CardRecord, success: (actionType: string, data: any) => void, cancel: () => void, current: any): React.SFCElement<{
        card: CardRecord;
        success: (actionType: string, data: any) => void;
        cancel: () => void;
        actionName: string;
        current: {
            tag: CardTagRecord;
            tagType: TagTypeRecord;
        };
    }>;
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
