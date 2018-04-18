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
var ExecuteCommand = /** @class */ (function (_super) {
    __extends(ExecuteCommand, _super);
    function ExecuteCommand() {
        var _this = _super.call(this, 'EXECUTE_COMMAND', 'Execute Command') || this;
        _this.getEditor = _this.createEditor;
        return _this;
    }
    ExecuteCommand.prototype.canEdit = function (action) {
        return !action.data.name;
    };
    ExecuteCommand.prototype.createEditor = function (card, success, cancel, current) {
        return React.createElement(Editor, { card: card, success: success, cancel: cancel, actionName: this.type, current: current });
    };
    ExecuteCommand.prototype.canApply = function (card, data) {
        return !card.isClosed;
    };
    ExecuteCommand.prototype.readConcurrencyData = function (card, actionData) {
        return undefined;
    };
    ExecuteCommand.prototype.reduce = function (card, data) {
        return card;
    };
    ExecuteCommand.prototype.fixData = function (data) {
        return data;
    };
    ExecuteCommand.prototype.processPendingAction = function (action) {
        return action;
    };
    return ExecuteCommand;
}(CardOperation));
export default ExecuteCommand;
//# sourceMappingURL=index.js.map