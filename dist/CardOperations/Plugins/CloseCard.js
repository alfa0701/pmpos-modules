"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardOperation_1 = require("../CardOperation");
class CloseCard extends CardOperation_1.default {
    constructor() {
        super('CLOSE_CARD', 'Close Card');
    }
    canEdit(action) {
        return false;
    }
    canApply(card, data) {
        return data.id && !card.isClosed && card.balance === 0;
    }
    readConcurrencyData(card, actionData) {
        return undefined;
    }
    reduce(card, data) {
        return card.set('isClosed', true);
    }
    fixData(data) {
        return data;
    }
    processPendingAction(action) {
        return action;
    }
}
exports.default = CloseCard;
//# sourceMappingURL=CloseCard.js.map