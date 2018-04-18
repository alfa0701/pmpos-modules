"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plugins_1 = require("./Plugins");
class CardOperations {
    constructor() {
        this.operations = new Map();
    }
    register(op) {
        this.operations.set(op.type, op);
    }
    canHandle(action) {
        return this.operations.has(action.actionType);
    }
    get(actionType) {
        return this.operations.get(actionType);
    }
    getConcurrencyData(actionType, card, actionData) {
        let operation = this.operations.get(actionType);
        return operation && operation.readConcurrencyData(card, actionData);
    }
    reduce(card, action) {
        let operation = this.operations.get(action.actionType);
        if (operation) {
            return this.reduceAll(card, action, operation);
        }
        return card;
    }
    reduceAll(card, action, operation) {
        if (!action.cardId || action.cardId === card.id) {
            return operation.reduce(card, action.data);
        }
        else {
            return card.update('cards', cards => {
                return cards.map(c => {
                    return this.reduceAll(c, action, operation);
                });
            });
        }
    }
    canReduce(card, action) {
        let operation = this.operations.get(action.actionType);
        return operation !== undefined && operation.canReduce !== undefined && operation.canReduce(card, action);
    }
    canApplyAction(card, action) {
        let operation = this.operations.get(action.actionType);
        if (!operation) {
            return false;
        }
        return operation.canApply(card, action.data);
    }
    getOperations() {
        return Array.from(this.operations.values()).filter(x => x.description);
    }
    fixData(actionType, data) {
        let operation = this.operations.get(actionType);
        if (operation) {
            return operation.fixData(data);
        }
        return data;
    }
    processPendingAction(action) {
        let operation = this.operations.get(action.actionType);
        if (operation) {
            return operation.processPendingAction(action);
        }
        return action;
    }
    canEdit(action) {
        let operation = this.operations.get(action.actionType);
        return operation !== undefined && operation.canEdit(action);
    }
}
exports.CardOperations = CardOperations;
exports.cardOperations = new CardOperations();
Plugins_1.default.forEach(x => exports.cardOperations.register(x));
//# sourceMappingURL=index.js.map