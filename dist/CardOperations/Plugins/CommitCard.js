"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardOperation_1 = require("../CardOperation");
class CommitCard extends CardOperation_1.default {
    constructor() {
        super('COMMIT_CARD', 'Commit Card');
    }
    canEdit(action) {
        return false;
    }
    canApply(card, data) {
        return data.id && !card.isClosed;
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
exports.default = CommitCard;
//# sourceMappingURL=CommitCard.js.map