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
import * as React from 'react';
import CardOperation from '../../CardOperation';
import Editor from './component';
var SelectCard = /** @class */ (function (_super) {
    __extends(SelectCard, _super);
    function SelectCard() {
        var _this = _super.call(this, 'SELECT_CARD', 'Select Card') || this;
        _this.getEditor = _this.createEditor;
        return _this;
    }
    SelectCard.prototype.canEdit = function (action) {
        return true;
    };
    SelectCard.prototype.createEditor = function (card, success, cancel, current) {
        return React.createElement(Editor, { card: card, success: success, cancel: cancel, actionName: this.type, current: current });
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
//# sourceMappingURL=index.js.map