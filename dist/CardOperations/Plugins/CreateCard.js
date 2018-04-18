"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardOperation_1 = require("../CardOperation");
const shortid = require("shortid");
const CardList_1 = require("../../CardList");
const pmpos_models_1 = require("pmpos-models");
class CreateCard extends CardOperation_1.default {
    constructor() {
        super('CREATE_CARD', 'Create Card');
    }
    canEdit(action) {
        return false;
    }
    canApply(card, data) {
        return data.id;
    }
    readConcurrencyData(card, actionData) {
        return undefined;
    }
    reduce(card, data) {
        let { id, typeId, type, time } = data;
        let result = new pmpos_models_1.CardRecord({ id, typeId, type, time });
        if (card.id && card.id !== '0') {
            result = card.update('cards', map => map.set(result.id, result));
        }
        return result;
    }
    fixData(data) {
        if (!data.id) {
            data.id = shortid.generate();
        }
        if (!data.typeId) {
            if (data.type) {
                data.typeId = CardList_1.default.getCardTypeIdByRef(data.type);
            }
        }
        if (!data.time || data.time === 0) {
            data.time = new Date().getTime();
        }
        return data;
    }
    processPendingAction(action) {
        return action;
    }
}
exports.default = CreateCard;
//# sourceMappingURL=CreateCard.js.map