import * as React from 'react';
import { Button } from 'material-ui';
import { DialogActions, DialogTitle } from 'material-ui';
import RuleManager from '../../../RuleManager';
import CardSelectorPage from '../../../../containers/CardSelectorPage';
export default (function (props) {
    return React.createElement(React.Fragment, null,
        React.createElement(DialogTitle, null, props.current.selected
            ? "Change " + props.current.type + ": " + props.current.selected
            : "Set " + props.current.type),
        React.createElement("div", { style: { margin: 4 } },
            React.createElement(CardSelectorPage, { cardType: props.current.type, onSelectCard: function (card) {
                    RuleManager.state.set(props.current.type, card.name);
                    props.success(props.actionName, props.current);
                } })),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: function () { return props.cancel(); } }, "Cancel")));
});
//# sourceMappingURL=component.js.map