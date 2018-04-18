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
var CloseCard = /** @class */ (function (_super) {
    __extends(CloseCard, _super);
    function CloseCard() {
        return _super.call(this, 'DISPLAY_CARD', 'Display Card') || this;
    }
    CloseCard.prototype.canEdit = function (action) {
        return false;
    };
    CloseCard.prototype.canApply = function (card, data) {
        return true;
    };
    CloseCard.prototype.readConcurrencyData = function (card, actionData) {
        return undefined;
    };
    CloseCard.prototype.reduce = function (card, data) {
        return card;
    };
    CloseCard.prototype.fixData = function (data) {
        return data;
    };
    CloseCard.prototype.processPendingAction = function (action) {
        return action;
    };
    return CloseCard;
}(CardOperation));
export default CloseCard;
//# sourceMappingURL=DisplayCard.js.map