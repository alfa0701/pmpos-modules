"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardOperation_1 = require("../CardOperation");
class SelectCard extends CardOperation_1.default {
    constructor() {
        super('SELECT_CARD', 'Select Card');
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
exports.default = SelectCard;
//# sourceMappingURL=SelectCard.js.map