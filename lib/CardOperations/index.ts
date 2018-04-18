import Plugins from './Plugins';
import CardOperation from './CardOperation';
import { ActionRecord, CardRecord } from 'pmpos-models';

export class CardOperations {
    operations: Map<string, CardOperation>;
    constructor() {
        this.operations = new Map<string, CardOperation>();
    }
    register(op: CardOperation) {
        this.operations.set(op.type, op);
    }
    canHandle(action: ActionRecord) {
        return this.operations.has(action.actionType);
    }
    get(actionType: string) {
        return this.operations.get(actionType);
    }
    getConcurrencyData(actionType: string, card: CardRecord, actionData: any) {
        let operation = this.operations.get(actionType);
        return operation && operation.readConcurrencyData(card, actionData);
    }
    reduce(card: CardRecord, action: ActionRecord): CardRecord {
        let operation = this.operations.get(action.actionType);
        if (operation) {
            return this.reduceAll(card, action, operation);
        }
        return card;
    }
    reduceAll(card: CardRecord, action: ActionRecord, operation: CardOperation): CardRecord {
        if (!action.cardId || action.cardId === card.id) {
            return operation.reduce(card, action.data);
        } else {
            return card.update('cards', cards => {
                return cards.map(c => {
                    return this.reduceAll(c, action, operation);
                });
            });
        }
    }
    canReduce(card: CardRecord, action: ActionRecord): boolean {
        let operation = this.operations.get(action.actionType);
        return operation !== undefined && operation.canReduce !== undefined && operation.canReduce(card, action);
    }
    canApplyAction(card: CardRecord, action: ActionRecord): boolean {
        let operation = this.operations.get(action.actionType);
        if (!operation) { return false; }
        return operation.canApply(card, action.data);
    }
    getOperations() {
        return Array.from(this.operations.values()).filter(x => x.description);
    }
    fixData(actionType: string, data: any): any {
        let operation = this.operations.get(actionType);
        if (operation) { return operation.fixData(data); }
        return data;
    }
    processPendingAction(action: ActionRecord): ActionRecord {
        let operation = this.operations.get(action.actionType);
        if (operation) { return operation.processPendingAction(action); }
        return action;
    }
    canEdit(action: ActionRecord): boolean {
        let operation = this.operations.get(action.actionType);
        return operation !== undefined && operation.canEdit(action);
    }
}

export const cardOperations: CardOperations = new CardOperations();
Plugins.forEach(x => cardOperations.register(x));