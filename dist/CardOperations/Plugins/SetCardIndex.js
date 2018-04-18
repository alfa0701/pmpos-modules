"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardOperation_1 = require("../CardOperation");
class SetCardTag extends CardOperation_1.default {
    constructor() {
        super('SET_CARD_INDEX', 'Set Card Index');
    }
    canEdit(action) {
        return true;
    }
    readConcurrencyData(card, data) {
        return undefined;
    }
    reduce(card, data) {
        return card.set('index', data.index);
    }
    fixData(data) {
        return data;
    }
    canApply(card, data) {
        return card.index !== data.index;
    }
    processPendingAction(action) {
        return action;
    }
}
exports.default = SetCardTag;
//# sourceMappingURL=SetCardIndex.js.map