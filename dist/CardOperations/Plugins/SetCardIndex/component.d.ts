import * as React from 'react';
import { CardRecord } from 'pmpos-models';
export default class  extends React.Component<{
    card: CardRecord;
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
    current?: any;
}, {
    index: string;
}> {
    constructor(props: any);
    componentDidMount(): void;
    render(): JSX.Element;
}
