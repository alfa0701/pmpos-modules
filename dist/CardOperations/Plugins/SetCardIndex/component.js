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
import { TextField, Button, DialogContent, DialogTitle, DialogActions } from 'material-ui';
import { Fragment } from 'react';
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { index: '' };
        return _this;
    }
    default_1.prototype.componentDidMount = function () {
        if (this.props.card) {
            this.setState({ index: this.props.card.index.toString() });
        }
    };
    default_1.prototype.render = function () {
        var _this = this;
        return (React.createElement(Fragment, null,
            React.createElement(DialogTitle, null, "Set Card Index"),
            React.createElement(DialogContent, null,
                React.createElement(TextField, { fullWidth: true, label: "Index", type: "number", value: this.state.index, onChange: function (e) { return _this.setState({ index: e.target.value }); } })),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: function (e) {
                        _this.props.success(_this.props.actionName, {
                            index: Number(_this.state.index)
                        });
                    } }, "Submit"))));
    };
    return default_1;
}(React.Component));
export default default_1;
//# sourceMappingURL=component.js.map