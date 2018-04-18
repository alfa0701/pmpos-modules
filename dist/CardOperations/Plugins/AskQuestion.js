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
var AskQuestion = /** @class */ (function (_super) {
    __extends(AskQuestion, _super);
    function AskQuestion() {
        return _super.call(this, 'ASK_QUESTION', 'Ask Question') || this;
    }
    AskQuestion.prototype.canEdit = function (action) {
        return true;
    };
    AskQuestion.prototype.canApply = function (card, data) {
        return !card.isClosed;
    };
    AskQuestion.prototype.readConcurrencyData = function (card, actionData) {
        return undefined;
    };
    AskQuestion.prototype.reduce = function (card, data) {
        return card;
    };
    AskQuestion.prototype.fixData = function (data) {
        return data;
    };
    AskQuestion.prototype.processPendingAction = function (action) {
        return action;
    };
    return AskQuestion;
}(CardOperation));
export default AskQuestion;
//# sourceMappingURL=AskQuestion.js.map