var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as shortid from 'shortid';
import CardOperation from '../CardOperation';
import CardList from '../../CardList';
import { CardTagRecord } from 'pmpos-models';
var SetCardTag = /** @class */ (function (_super) {
    __extends(SetCardTag, _super);
    function SetCardTag() {
        var _this = _super.call(this, 'SET_CARD_TAG', 'Set Card Tag') || this;
        _this.canReduce = _this.canReduceCard;
        return _this;
    }
    SetCardTag.prototype.canEdit = function (action) {
        return !action.data.value;
    };
    SetCardTag.prototype.readConcurrencyData = function (card, data) {
        return card.getIn(['tags', data.name]);
    };
    SetCardTag.prototype.tagValueRemoved = function (card, data) {
        return card.tags.has(data.name)
            && card.getTag(data.name, undefined)
            && !data.value;
    };
    SetCardTag.prototype.tagAmountRemoved = function (card, data) {
        return card.tags.has(data.name) && data.func && data.amount === 0;
    };
    SetCardTag.prototype.reduce = function (card, data) {
        var fixedData = this.fixData(data);
        // fixedData = this.fixType(card, fixedData);
        var r = new CardTagRecord(fixedData);
        if (this.tagValueRemoved(card, data)) {
            return card.deleteIn(['tags', data.name]);
        }
        if (this.tagAmountRemoved(card, data)) {
            return card.deleteIn(['tags', data.name]);
        }
        return card.setIn(['tags', data.name], r);
    };
    SetCardTag.prototype.canReduceCard = function (card, action) {
        var current = this.readConcurrencyData(card, action.data);
        return !current || current.value === action.concurrencyData.value;
    };
    SetCardTag.prototype.fixData = function (data) {
        if (!Number.isNaN(Number(data.quantity))) {
            data.quantity = Number(data.quantity);
        }
        if (!Number.isNaN(Number(data.amount))) {
            data.amount = Number(data.amount);
        }
        if (!data.typeId && data.type) {
            var tt = CardList.tagTypes.find(function (x) { return x.name === data.type; });
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
                if ((!data.amount || data.amount === 0) && tt.defaultAmount) {
                    data.amount = tt.defaultAmount;
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
                    var card = CardList.getCardByName(tt.cardTypeReferenceName, data.value);
                    if (card) {
                        if (!data.name) {
                            data.name = tt.cardTypeReferenceName;
                        }
                        if (!data.amount || data.amount === 0) {
                            var amount = card.getTag('Amount', 0);
                            if (amount) {
                                data.amount = amount;
                            }
                        }
                        if (!data.source) {
                            var source = card.getTag('Source', '');
                            if (source) {
                                data.source = source;
                            }
                        }
                        if (!data.target) {
                            var target = card.getTag('Target', undefined);
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
    };
    SetCardTag.prototype.valueNeeded = function (data, currentValue) {
        return (!currentValue || !currentValue.value) && (data.name.startsWith('_') || data.typeId);
    };
    SetCardTag.prototype.amountNeeded = function (data, currentValue) {
        return (!currentValue || currentValue.amount === 0) && data.func;
    };
    SetCardTag.prototype.valueChanged = function (currentValue, data) {
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
        if (currentValue.amount !== data.amount) {
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
    };
    SetCardTag.prototype.canApply = function (card, data) {
        var currentValue = card.getIn(['tags', data.name]);
        if (!data.name || (this.valueNeeded(data, currentValue) && !data.value)) {
            return false;
        }
        if (this.amountNeeded(data, currentValue) && data.amount === 0) {
            return false;
        }
        return this.valueChanged(currentValue, data);
    };
    SetCardTag.prototype.processPendingAction = function (action) {
        var data = action.data;
        data.cardId = '';
        if (!action.data || !action.data.typeId || !action.data.name || !action.data.value) {
            return action.set('data', data);
        }
        var tagType = CardList.tagTypes.get(data.typeId);
        if (tagType) {
            var cardType = CardList.getCardTypeByRef(tagType.cardTypeReferenceName);
            if (cardType) {
                var card = CardList.getCardByName(cardType.name, action.data.value);
                data.cardId = card ? card.id : '';
            }
            if (data.source && tagType.sourceCardTypeReferenceName) {
                var sourceCardType = CardList.getCardTypeByRef(tagType.sourceCardTypeReferenceName);
                if (sourceCardType) {
                    var sourceCard = CardList.getCardByName(sourceCardType.name, data.source);
                    data.sourceCardId = sourceCard ? sourceCard.id : '';
                }
            }
            if (data.target && tagType.targetCardTypeReferenceName) {
                var targetCardType = CardList.getCardTypeByRef(tagType.targetCardTypeReferenceName);
                if (targetCardType) {
                    var targetCard = CardList.getCardByName(targetCardType.name, data.target);
                    data.targetCardId = targetCard ? targetCard.id : '';
                }
            }
        }
        return action.set('data', data);
    };
    return SetCardTag;
}(CardOperation));
export default SetCardTag;
//# sourceMappingURL=SetCardTag.js.map