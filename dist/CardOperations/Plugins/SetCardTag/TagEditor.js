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
import * as shortid from 'shortid';
import AutoSuggest from '../../../../components/AutoSuggest';
import { TextField, DialogContent, DialogActions, Button } from 'material-ui';
import CardList from '../../../CardList';
var TagEditor = /** @class */ (function (_super) {
    __extends(TagEditor, _super);
    function TagEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.getState = function (props) {
            var tagType = props.tagType, tag = props.tag;
            return {
                typeId: tagType.id,
                name: tag.name || tagType.tagName || tagType.cardTypeReferenceName,
                value: tag.value || tagType.defaultValue,
                quantity: String(tag.quantity !== 0 ? tag.quantity : tagType.defaultQuantity),
                unit: tag.unit || tagType.defaultUnit,
                amount: String(tag.amount !== 0 ? tag.amount : tagType.defaultAmount),
                func: tag.func || tagType.defaultFunction,
                source: tag.source || tagType.defaultSource,
                target: tag.target || tagType.defaultTarget
            };
        };
        _this.state = _this.getState(props);
        return _this;
    }
    TagEditor.prototype.handleTagValueChange = function (value) {
        this.setState({ value: value });
        if (this.props.tagType.cardTypeReferenceName) {
            var card = CardList.getCardByName(this.props.tagType.cardTypeReferenceName, value);
            if (card) {
                if (Number(this.state.amount) === 0) {
                    this.setState({ amount: String(card.getTag('Amount', '')) });
                }
                if (!this.state.source) {
                    this.setState({ source: String(card.getTag('Source', '')) });
                }
                if (!this.state.target) {
                    this.setState({ target: String(card.getTag('Target', '')) });
                }
            }
        }
    };
    TagEditor.prototype.render = function () {
        var _this = this;
        var canEditName = Boolean(!this.props.tag.name && !this.props.tagType.id);
        var canEditValue = !this.props.tagType.id || this.props.tagType.showValue;
        var canEditQuantity = !this.props.tagType.id || this.props.tagType.showQuantity;
        var canEditUnit = !this.props.tagType.id || this.props.tagType.showUnit;
        var canEditAmount = !this.props.tagType.id || this.props.tagType.showAmount;
        var canEditSource = !this.props.tagType.id || this.props.tagType.showSource;
        var canEditTarget = !this.props.tagType.id || this.props.tagType.showTarget;
        var canEditFunction = !this.props.tagType.id || this.props.tagType.showFunction;
        return (React.createElement(React.Fragment, null,
            React.createElement(DialogContent, null,
                canEditName && React.createElement(TextField, { fullWidth: true, label: "Tag Name", value: this.state.name, onChange: function (e) { return _this.setState({ name: e.target.value }); } }),
                canEditValue && React.createElement(AutoSuggest, { label: this.props.tagType
                        && this.props.tagType.tagName
                        ? this.props.tagType.tagName
                        : 'Tag Value', value: this.state.value, getSuggestions: function (value) {
                        return CardList.getCardSuggestions(_this.props.tagType.cardTypeReferenceName, value);
                    }, handleChange: function (e, value) { return _this.handleTagValueChange(value); } }),
                canEditQuantity && React.createElement(TextField, { fullWidth: true, label: "Quantity", type: "number", value: this.state.quantity, onChange: function (e) { return _this.setState({ quantity: e.target.value }); } }),
                canEditUnit && React.createElement(TextField, { fullWidth: true, label: "Unit", value: this.state.unit, onChange: function (e) { return _this.setState({ unit: e.target.value }); } }),
                canEditAmount && React.createElement(TextField, { fullWidth: true, label: "Amount", type: "number", value: this.state.amount, onChange: function (e) { return _this.setState({ amount: e.target.value }); } }),
                canEditFunction && React.createElement(TextField, { fullWidth: true, label: "Function", value: this.state.func, onChange: function (e) { return _this.setState({ func: e.target.value }); } }),
                canEditSource && React.createElement(AutoSuggest, { label: this.props.tagType.sourceCardTypeReferenceName || 'Source', value: this.state.source, getSuggestions: function (value) { return CardList.getCardSuggestions(_this.props.tagType.sourceCardTypeReferenceName, value); }, handleChange: function (e, source) { return _this.setState({ source: source }); } }),
                canEditTarget && React.createElement(AutoSuggest, { label: this.props.tagType.targetCardTypeReferenceName || 'Target', value: this.state.target, getSuggestions: function (value) { return CardList.getCardSuggestions(_this.props.tagType.targetCardTypeReferenceName, value); }, handleChange: function (e, target) { return _this.setState({ target: target }); } })),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: function (e) { return _this.props.onSubmit({
                        id: shortid.generate(),
                        name: _this.state.name || "_" + shortid.generate(),
                        value: _this.state.value,
                        quantity: Number(_this.state.quantity),
                        unit: _this.state.unit,
                        amount: Number(_this.state.amount),
                        func: _this.state.func,
                        source: _this.state.source,
                        target: _this.state.target,
                        typeId: _this.state.typeId
                    }); } }, "Submit"))));
    };
    return TagEditor;
}(React.Component));
export default TagEditor;
//# sourceMappingURL=TagEditor.js.map