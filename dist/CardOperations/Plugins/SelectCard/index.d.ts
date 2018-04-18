import * as React from 'react';
import CardOperation from '../../CardOperation';
import { CardRecord, ActionRecord } from 'pmpos-models';
export default class SelectCard extends CardOperation {
    constructor();
    canEdit(action: ActionRecord): boolean;
    createEditor(card: CardRecord, success: (actionType: string, data: any) => void, cancel: () => void, current: any): React.SFCElement<{
        card: CardRecord;
        success: (actionType: string, data: any) => void;
        cancel: () => void;
        actionName: string;
        current: any;
    }>;
    canApply(card: CardRecord, data: any): boolean;
    readConcurrencyData(card: CardRecord, actionData: any): undefined;
    reduce(card: CardRecord, data: any): CardRecord;
    fixData(data: any): any;
    processPendingAction(action: ActionRecord): ActionRecord;
}
