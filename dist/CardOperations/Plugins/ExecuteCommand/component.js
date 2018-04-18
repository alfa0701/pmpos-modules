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
import { TextField, Button } from 'material-ui';
import * as shortid from 'shortid';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            name: '', parameters: ''
        };
        return _this;
    }
    default_1.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement(DialogTitle, null, "Execute Command"),
            React.createElement(DialogContent, null,
                React.createElement(TextField, { label: "Name", value: this.state.name, onChange: function (e) { return _this.setState({ name: e.target.value }); } }),
                React.createElement(TextField, { label: "Parameters", value: this.state.parameters, onChange: function (e) { return _this.setState({ parameters: e.target.value }); } })),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: function (e) {
                        _this.props.success(_this.props.actionName, {
                            id: shortid.generate(),
                            name: _this.state.name,
                            parameters: _this.state.parameters.split(',')
                                .reduce(function (r, p) {
                                var parts = p.split(',');
                                r[parts[0]] = parts[1];
                                return r;
                            }, {})
                        });
                    } }, "Submit"))));
    };
    return default_1;
}(React.Component));
export default default_1;
//# sourceMappingURL=component.js.map