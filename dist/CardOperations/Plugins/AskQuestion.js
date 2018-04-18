"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardOperation_1 = require("../CardOperation");
class AskQuestion extends CardOperation_1.default {
    constructor() {
        super('ASK_QUESTION', 'Ask Question');
    }
    canEdit(action) {
        return true;
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
exports.default = AskQuestion;
//# sourceMappingURL=AskQuestion.js.map