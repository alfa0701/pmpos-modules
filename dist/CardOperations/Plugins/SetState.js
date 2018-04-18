"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardOperation_1 = require("../CardOperation");
const RuleManager_1 = require("../../RuleManager");
class SetState extends CardOperation_1.default {
    constructor() {
        super('SET_STATE', 'Set State');
    }
    canEdit(action) {
        return false;
    }
    canApply(card, data) {
        return !card.isClosed;
    }
    readConcurrencyData(card, actionData) {
        return undefined;
    }
    reduce(card, data) {
        if (data.name) {
            RuleManager_1.default.setState(data.name, data.value);
        }
        return card;
    }
    fixData(data) {
        return data;
    }
    processPendingAction(action) {
        return action;
    }
}
exports.default = SetState;
//# sourceMappingURL=SetState.js.map