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
import CardOperation from '../CardOperation';
import * as shortid from 'shortid';
import CardList from '../../CardList';
import { CardRecord } from 'pmpos-models';
var CreateCard = /** @class */ (function (_super) {
    __extends(CreateCard, _super);
    function CreateCard() {
        return _super.call(this, 'CREATE_CARD', 'Create Card') || this;
    }
    CreateCard.prototype.canEdit = function (action) {
        return false;
    };
    CreateCard.prototype.canApply = function (card, data) {
        return data.id;
    };
    CreateCard.prototype.readConcurrencyData = function (card, actionData) {
        return undefined;
    };
    CreateCard.prototype.reduce = function (card, data) {
        var id = data.id, typeId = data.typeId, type = data.type, time = data.time;
        var result = new CardRecord({ id: id, typeId: typeId, type: type, time: time });
        if (card.id && card.id !== '0') {
            result = card.update('cards', function (map) { return map.set(result.id, result); });
        }
        return result;
    };
    CreateCard.prototype.fixData = function (data) {
        if (!data.id) {
            data.id = shortid.generate();
        }
        if (!data.typeId) {
            if (data.type) {
                data.typeId = CardList.getCardTypeIdByRef(data.type);
            }
        }
        if (!data.time || data.time === 0) {
            data.time = new Date().getTime();
        }
        return data;
    };
    CreateCard.prototype.processPendingAction = function (action) {
        return action;
    };
    return CreateCard;
}(CardOperation));
export default CreateCard;
//# sourceMappingURL=CreateCard.js.map