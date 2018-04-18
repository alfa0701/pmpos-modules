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
var SelectCard = /** @class */ (function (_super) {
    __extends(SelectCard, _super);
    function SelectCard() {
        return _super.call(this, 'SELECT_CARD', 'Select Card') || this;
    }
    SelectCard.prototype.canEdit = function (action) {
        return true;
    };
    SelectCard.prototype.canApply = function (card, data) {
        return !card.isClosed;
    };
    SelectCard.prototype.readConcurrencyData = function (card, actionData) {
        return undefined;
    };
    SelectCard.prototype.reduce = function (card, data) {
        return card;
    };
    SelectCard.prototype.fixData = function (data) {
        return data;
    };
    SelectCard.prototype.processPendingAction = function (action) {
        return action;
    };
    return SelectCard;
}(CardOperation));
export default SelectCard;
//# sourceMappingURL=SelectCard.js.map