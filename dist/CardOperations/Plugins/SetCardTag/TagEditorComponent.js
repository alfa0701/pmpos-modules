import * as React from 'react';
import { DialogTitle } from 'material-ui';
import TagEditor from './TagEditor';
export default (function (props) {
    return React.createElement(React.Fragment, null,
        React.createElement(DialogTitle, null, "Set " + (props.current.tagType.id
            ? props.current.tagType.tagName || props.current.tagType.cardTypeReferenceName
            : ' Card Tag')),
        React.createElement(TagEditor, { tag: props.current.tag, tagType: props.current.tagType, onSubmit: function (data) { return props.success(props.actionName, data); } }));
});
//# sourceMappingURL=TagEditorComponent.js.map