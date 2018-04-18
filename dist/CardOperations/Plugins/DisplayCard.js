"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardOperation_1 = require("../CardOperation");
class CloseCard extends CardOperation_1.default {
    constructor() {
        super('DISPLAY_CARD', 'Display Card');
    }
    canEdit(action) {
        return false;
    }
    canApply(card, data) {
        return true;
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
exports.default = CloseCard;
//# sourceMappingURL=DisplayCard.js.map