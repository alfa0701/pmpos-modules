"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardOperation_1 = require("../CardOperation");
class ExecuteCommand extends CardOperation_1.default {
    constructor() {
        super('EXECUTE_COMMAND', 'Execute Command');
    }
    canEdit(action) {
        return !action.data.name;
    }
    canApply(card, data) {
        return !card.isClosed;
    }
    readConcurrencyData(card, actionData) {
        return undefined;
    }
    reduce(card, data) {
        return card;
    }
    fixData(data) {
        return data;
    }
    processPendingAction(action) {
        return action;
    }
}
exports.default = ExecuteCommand;
//# sourceMappingURL=ExecuteCommand.js.map