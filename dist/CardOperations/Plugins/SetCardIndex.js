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
var SetCardTag = /** @class */ (function (_super) {
    __extends(SetCardTag, _super);
    function SetCardTag() {
        return _super.call(this, 'SET_CARD_INDEX', 'Set Card Index') || this;
    }
    SetCardTag.prototype.canEdit = function (action) {
        return true;
    };
    SetCardTag.prototype.readConcurrencyData = function (card, data) {
        return undefined;
    };
    SetCardTag.prototype.reduce = function (card, data) {
        return card.set('index', data.index);
    };
    SetCardTag.prototype.fixData = function (data) {
        return data;
    };
    SetCardTag.prototype.canApply = function (card, data) {
        return card.index !== data.index;
    };
    SetCardTag.prototype.processPendingAction = function (action) {
        return action;
    };
    return SetCardTag;
}(CardOperation));
export default SetCardTag;
//# sourceMappingURL=SetCardIndex.js.map