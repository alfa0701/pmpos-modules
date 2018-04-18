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
import RuleManager from '../../RuleManager';
var SetState = /** @class */ (function (_super) {
    __extends(SetState, _super);
    function SetState() {
        return _super.call(this, 'SET_STATE', 'Set State') || this;
    }
    SetState.prototype.canEdit = function (action) {
        return false;
    };
    SetState.prototype.canApply = function (card, data) {
        return !card.isClosed;
    };
    SetState.prototype.readConcurrencyData = function (card, actionData) {
        return undefined;
    };
    SetState.prototype.reduce = function (card, data) {
        if (data.name) {
            RuleManager.setState(data.name, data.value);
        }
        return card;
    };
    SetState.prototype.fixData = function (data) {
        return data;
    };
    SetState.prototype.processPendingAction = function (action) {
        return action;
    };
    return SetState;
}(CardOperation));
export default SetState;
//# sourceMappingURL=SetState.js.map