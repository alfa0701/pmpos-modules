var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import TagEditorComponent from './TagEditorComponent';
import TagSelectionComponent from './TagSelectionComponent';
export default (function (props) {
    var tagType = props.current.tagType;
    if (tagType.isTagSelection()) {
        return React.createElement(TagSelectionComponent, __assign({}, props));
    }
    return React.createElement(TagEditorComponent, __assign({}, props));
});
//# sourceMappingURL=component.js.map