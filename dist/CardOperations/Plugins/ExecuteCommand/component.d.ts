import * as React from 'react';
import { CardRecord } from 'pmpos-models';
export default class  extends React.Component<{
    card: CardRecord;
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
}, {
    name: string;
    parameters: string;
}> {
    constructor(props: any);
    render(): JSX.Element;
}
