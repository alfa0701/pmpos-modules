"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shortid = require("shortid");
const CardOperation_1 = require("../CardOperation");
const CardList_1 = require("../../CardList");
const pmpos_models_1 = require("pmpos-models");
class SetCardTag extends CardOperation_1.default {
    constructor() {
        super('SET_CARD_TAG', 'Set Card Tag');
        this.canReduce = this.canReduceCard;
    }
    canEdit(action) {
        return !action.data.value;
    }
    readConcurrencyData(card, data) {
        return card.getIn(['tags', data.name]);
    }
    tagValueRemoved(card, data) {
        return card.tags.has(data.name)
            && card.getTag(data.name, undefined)
            && !data.value;
    }
    tagPriceRemoved(card, data) {
        return card.tags.has(data.name) && data.func && data.price === 0;
    }
    reduce(card, data) {
        let fixedData = this.fixData(data);
        // fixedData = this.fixType(card, fixedData);
        let r = new pmpos_models_1.CardTagRecord(fixedData);
        if (this.tagValueRemoved(card, data)) {
            return card.deleteIn(['tags', data.name]);
        }
        if (this.tagPriceRemoved(card, data)) {
            return card.deleteIn(['tags', data.name]);
        }
        return card.setIn(['tags', data.name], r);
    }
    canReduceCard(card, action) {
        let current = this.readConcurrencyData(card, action.data);
        return !current || current.value === action.concurrencyData.value;
    }
    fixData(data) {
        if (!Number.isNaN(Number(data.quantity))) {
            data.quantity = Number(data.quantity);
        }
        if (!Number.isNaN(Number(data.price))) {
            data.price = Number(data.price);
        }
        if (!data.typeId && data.type) {
            let tt = CardList_1.default.tagTypes.find(x => x.name === data.type);
            // if (!tt) { data.type = ''; } 
            // Should we clear that? If we have a type that never exists it will continously try to fix that.
            if (tt) {
                data.typeId = tt.id;
                if (!data.name && tt.tagName) {
                    data.name = tt.tagName;
                }
                if (!data.value && tt.defaultValue) {
                    data.value = tt.defaultValue;
                }
                if ((!data.quantity || data.quantity === 0) && tt.defaultQuantity) {
                    data.quantity = tt.defaultQuantity;
                }
                if (!data.unit && tt.defaultUnit) {
                    data.unit = tt.defaultUnit;
                }
                if ((!data.price || data.price === 0) && tt.defaultPrice) {
                    data.price = tt.defaultPrice;
                }
                if (!data.func && tt.defaultFunction) {
                    data.func = tt.defaultFunction;
                }
                if (!data.source && tt.defaultSource) {
                    data.source = tt.defaultSource;
                }
                if (!data.target && tt.defaultTarget) {
                    data.target = tt.defaultTarget;
                }
                if (tt.cardTypeReferenceName && data.value) {
                    let card = CardList_1.default.getCardByName(tt.cardTypeReferenceName, data.value);
                    if (card) {
                        if (!data.name) {
                            data.name = tt.cardTypeReferenceName;
                        }
                        if (!data.price || data.price === 0) {
                            let price = card.getTag('Price', 0);
                            if (price) {
                                data.price = price;
                            }
                        }
                        if (!data.source) {
                            let source = card.getTag('Source', '');
                            if (source) {
                                data.source = source;
                            }
                        }
                        if (!data.target) {
                            let target = card.getTag('Target', undefined);
                            if (target) {
                                data.target = target;
                            }
                        }
                    }
                }
            }
        }
        if (!data.name && data.value) {
            data.name = '_' + shortid.generate();
        }
        if (!data.id) {
            data.id = shortid.generate();
        }
        return data;
    }
    valueNeeded(data, currentValue) {
        return (!currentValue || !currentValue.value) && (data.name.startsWith('_') || data.typeId);
    }
    priceNeeded(data, currentValue) {
        return (!currentValue || currentValue.price === 0) && data.func;
    }
    valueChanged(currentValue, data) {
        if (!currentValue) {
            return true;
        }
        if (currentValue.value !== data.value) {
            return true;
        }
        if (currentValue.quantity !== data.quantity) {
            return true;
        }
        if (currentValue.unit !== data.unit) {
            return true;
        }
        if (currentValue.price !== data.price) {
            return true;
        }
        if (currentValue.func !== data.func) {
            return true;
        }
        if (currentValue.source !== data.source) {
            return true;
        }
        if (currentValue.target !== data.target) {
            return true;
        }
        return false;
    }
    canApply(card, data) {
        let currentValue = card.getIn(['tags', data.name]);
        if (!data.name || (this.valueNeeded(data, currentValue) && !data.value)) {
            return false;
        }
        if (this.priceNeeded(data, currentValue) && data.price === 0) {
            return false;
        }
        return this.valueChanged(currentValue, data);
    }
    processPendingAction(action) {
        let data = action.data;
        data.cardId = '';
        if (!action.data || !action.data.typeId || !action.data.name || !action.data.value) {
            return action.set('data', data);
        }
        let tagType = CardList_1.default.tagTypes.get(data.typeId);
        if (tagType) {
            let cardType = CardList_1.default.getCardTypeByRef(tagType.cardTypeReferenceName);
            if (cardType) {
                let card = CardList_1.default.getCardByName(cardType.name, action.data.value);
                data.cardId = card ? card.id : '';
            }
            if (data.source && tagType.sourceCardTypeReferenceName) {
                let sourceCardType = CardList_1.default.getCardTypeByRef(tagType.sourceCardTypeReferenceName);
                if (sourceCardType) {
                    let sourceCard = CardList_1.default.getCardByName(sourceCardType.name, data.source);
                    data.sourceCardId = sourceCard ? sourceCard.id : '';
                }
            }
            if (data.target && tagType.targetCardTypeReferenceName) {
                let targetCardType = CardList_1.default.getCardTypeByRef(tagType.targetCardTypeReferenceName);
                if (targetCardType) {
                    let targetCard = CardList_1.default.getCardByName(targetCardType.name, data.target);
                    data.targetCardId = targetCard ? targetCard.id : '';
                }
            }
        }
        return action.set('data', data);
    }
}
exports.default = SetCardTag;
//# sourceMappingURL=SetCardTag.js.map