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
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import Typography from 'material-ui/Typography/Typography';
import decorate from './style';
import { Map as IMap } from 'immutable';
import RuleManager from '../../../RuleManager';
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            question: '',
            parameters: {},
            parameterState: IMap()
        };
        return _this;
    }
    Component.prototype.componentWillReceiveProps = function (props) {
        var _this = this;
        if (props.current) {
            Object.keys(props.current.parameters).forEach(function (key) {
                var value = props.current.parameters[key];
                if (Array.isArray(value)) {
                    _this.setState({ parameterState: _this.state.parameterState.set(key, '') });
                }
                else {
                    _this.setState({ parameterState: _this.state.parameterState.set(key, value) });
                }
            });
        }
    };
    Component.prototype.componentDidMount = function () {
        if (this.props.current) {
            this.setState({
                question: this.props.current.question,
                // "parameters":{"Name":"","Age":["1","2","3"]}
                parameters: this.props.current.parameters
            });
        }
    };
    Component.prototype.getParamEditor = function (key, value) {
        var _this = this;
        if (Array.isArray(value)) {
            return (React.createElement("div", { key: key },
                React.createElement(Typography, { variant: "body2" }, key),
                React.createElement("div", { className: this.props.classes.buttonContainer }, (Array.apply(void 0, value).map(function (item) { return (React.createElement(Button, { color: _this.state.parameterState.get(key) === item ? 'secondary' : 'default', key: item, variant: "raised", className: _this.props.classes.selectionButton, onClick: function (e) { return _this.setState({
                        parameterState: _this.state.parameterState.set(key, item)
                    }); } }, item)); })))));
        }
        return React.createElement(TextField, { label: key, key: key, type: this.getEditorType(key), value: this.getTextValue(key), onChange: function (e) { return _this.setTextValue(key, e.target.value); } });
    };
    Component.prototype.getEditorType = function (key) {
        var val = this.state.parameters[key];
        var isNumber = !isNaN(parseFloat(val)) && isFinite(val);
        return isNumber ? 'number' : 'text';
    };
    Component.prototype.getTextValue = function (key) {
        return this.state.parameterState.get(key) || '';
    };
    Component.prototype.setTextValue = function (key, value) {
        this.setState({ parameterState: this.state.parameterState.set(key, value) });
    };
    Component.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement(DialogTitle, null, this.state.question),
            React.createElement(DialogContent, { style: { display: 'flex', flexFlow: 'column' } }, Object.keys(this.state.parameters)
                .map(function (key) { return _this.getParamEditor(key, _this.state.parameters[key]); })),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: function (e) {
                        Object.keys(_this.props.current.parameters).map(function (key) {
                            var value = _this.state.parameterState.get(key);
                            RuleManager.setState(key, value);
                        });
                        _this.props.success(_this.props.actionName, _this.props.current);
                    } }, "Submit"))));
    };
    return Component;
}(React.Component));
export default decorate(Component);
//# sourceMappingURL=component.js.map