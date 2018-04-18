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
var CommitCard = /** @class */ (function (_super) {
    __extends(CommitCard, _super);
    function CommitCard() {
        return _super.call(this, 'COMMIT_CARD', 'Commit Card') || this;
    }
    CommitCard.prototype.canEdit = function (action) {
        return false;
    };
    CommitCard.prototype.canApply = function (card, data) {
        return data.id && !card.isClosed;
    };
    CommitCard.prototype.readConcurrencyData = function (card, actionData) {
        return undefined;
    };
    CommitCard.prototype.reduce = function (card, data) {
        return card;
    };
    CommitCard.prototype.fixData = function (data) {
        return data;
    };
    CommitCard.prototype.processPendingAction = function (action) {
        return action;
    };
    return CommitCard;
}(CardOperation));
export default CommitCard;
//# sourceMappingURL=CommitCard.js.map