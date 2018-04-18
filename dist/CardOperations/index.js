import Plugins from './Plugins';
var CardOperations = /** @class */ (function () {
    function CardOperations() {
        this.operations = new Map();
    }
    CardOperations.prototype.register = function (op) {
        this.operations.set(op.type, op);
    };
    CardOperations.prototype.canHandle = function (action) {
        return this.operations.has(action.actionType);
    };
    CardOperations.prototype.get = function (actionType) {
        return this.operations.get(actionType);
    };
    CardOperations.prototype.getConcurrencyData = function (actionType, card, actionData) {
        var operation = this.operations.get(actionType);
        return operation && operation.readConcurrencyData(card, actionData);
    };
    CardOperations.prototype.reduce = function (card, action) {
        var operation = this.operations.get(action.actionType);
        if (operation) {
            return this.reduceAll(card, action, operation);
        }
        return card;
    };
    CardOperations.prototype.reduceAll = function (card, action, operation) {
        var _this = this;
        if (!action.cardId || action.cardId === card.id) {
            return operation.reduce(card, action.data);
        }
        else {
            return card.update('cards', function (cards) {
                return cards.map(function (c) {
                    return _this.reduceAll(c, action, operation);
                });
            });
        }
    };
    CardOperations.prototype.canReduce = function (card, action) {
        var operation = this.operations.get(action.actionType);
        return operation !== undefined && operation.canReduce !== undefined && operation.canReduce(card, action);
    };
    CardOperations.prototype.canApplyAction = function (card, action) {
        var operation = this.operations.get(action.actionType);
        if (!operation) {
            return false;
        }
        return operation.canApply(card, action.data);
    };
    CardOperations.prototype.getOperations = function () {
        return Array.from(this.operations.values()).filter(function (x) { return x.description; });
    };
    CardOperations.prototype.fixData = function (actionType, data) {
        var operation = this.operations.get(actionType);
        if (operation) {
            return operation.fixData(data);
        }
        return data;
    };
    CardOperations.prototype.processPendingAction = function (action) {
        var operation = this.operations.get(action.actionType);
        if (operation) {
            return operation.processPendingAction(action);
        }
        return action;
    };
    CardOperations.prototype.canEdit = function (action) {
        var operation = this.operations.get(action.actionType);
        return operation !== undefined && operation.canEdit(action);
    };
    return CardOperations;
}());
export { CardOperations };
export var cardOperations = new CardOperations();
Plugins.forEach(function (x) { return cardOperations.register(x); });
//# sourceMappingURL=index.js.map