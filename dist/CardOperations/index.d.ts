import CardOperation from './CardOperation';
import { ActionRecord, CardRecord } from 'pmpos-models';
export declare class CardOperations {
    operations: Map<string, CardOperation>;
    constructor();
    register(op: CardOperation): void;
    canHandle(action: ActionRecord): boolean;
    get(actionType: string): CardOperation | undefined;
    getConcurrencyData(actionType: string, card: CardRecord, actionData: any): any;
    reduce(card: CardRecord, action: ActionRecord): CardRecord;
    reduceAll(card: CardRecord, action: ActionRecord, operation: CardOperation): CardRecord;
    canReduce(card: CardRecord, action: ActionRecord): boolean;
    canApplyAction(card: CardRecord, action: ActionRecord): boolean;
    getOperations(): CardOperation[];
    fixData(actionType: string, data: any): any;
    processPendingAction(action: ActionRecord): ActionRecord;
    canEdit(action: ActionRecord): boolean;
}
export declare const cardOperations: CardOperations;
