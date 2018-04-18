var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import { DialogTitle, DialogActions, Button } from 'material-ui';
import CardSelectorPage from '../../../../containers/CardSelectorPage';
export default (function (props) {
    var tagType = props.current.tagType;
    return React.createElement(React.Fragment, null,
        React.createElement(DialogTitle, null, props.current.tag.value
            ? "Change " + (tagType.tagName || tagType.cardTypeReferenceName) + ": " + props.current.tag.value
            : "Set " + (tagType.tagName || tagType.cardTypeReferenceName)),
        React.createElement("div", { style: { margin: 4 } },
            React.createElement(CardSelectorPage, { cardType: tagType.cardTypeReferenceName, onSelectCard: function (card) {
                    var data = __assign({}, props.current.tag.toJS(), { name: tagType.tagName, value: card.name, type: tagType.name });
                    props.success(props.actionName, data);
                } })),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: function () { return props.cancel(); } }, "Cancel")));
});
//# sourceMappingURL=TagSelectionComponent.js.map