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
var ExecuteCommand = /** @class */ (function (_super) {
    __extends(ExecuteCommand, _super);
    function ExecuteCommand() {
        return _super.call(this, 'EXECUTE_COMMAND', 'Execute Command') || this;
    }
    ExecuteCommand.prototype.canEdit = function (action) {
        return !action.data.name;
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
//# sourceMappingURL=ExecuteCommand.js.map