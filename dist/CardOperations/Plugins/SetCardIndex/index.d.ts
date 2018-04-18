import * as React from 'react';
import CardOperation from '../../CardOperation';
import IndexEditor from './component';
import { CardRecord, ActionRecord } from 'pmpos-models';
export default class SetCardTag extends CardOperation {
    constructor();
    canEdit(action: ActionRecord): boolean;
    createEditor(card: CardRecord, success: (actionType: string, data: any) => void, cancel: () => void, current: any): React.ComponentElement<any, IndexEditor>;
    readConcurrencyData(card: CardRecord, data: any): undefined;
    reduce(card: CardRecord, data: any): CardRecord;
    fixData(data: any): any;
    canApply(card: CardRecord, data: any): boolean;
    processPendingAction(action: ActionRecord): ActionRecord;
}
