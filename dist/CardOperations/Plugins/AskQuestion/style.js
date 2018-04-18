import withStyles from 'material-ui/styles/withStyles';
export default withStyles(function (_a) {
    var palette = _a.palette, spacing = _a.spacing, breakpoints = _a.breakpoints;
    return ({
        buttonContainer: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        selectionButton: {
            flexGrow: 1,
            minWidth: '22%',
            margin: spacing.unit / 2
        },
        container: {
            flexGrow: 1,
            position: 'relative'
        },
        suggestionsContainerOpen: {
            position: 'absolute',
            marginTop: spacing.unit,
            marginBottom: spacing.unit * 3,
            left: 0,
            right: 0,
        },
        suggestion: {
            display: 'block',
        },
        suggestionsList: {
            margin: 0,
            padding: 0,
            listStyleType: 'none'
        },
        textField: {
            width: '100%',
        },
    });
});
//# sourceMappingURL=style.js.map