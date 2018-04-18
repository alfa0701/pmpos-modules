import { Map as IMap } from 'immutable';
import { CardRecord, RuleRecord, ActionRecord } from 'pmpos-models';
export declare class ActionType {
    data: any;
    type: string;
    params: {};
    constructor(type: string, data: any);
}
export declare class RuleManager {
    state: Map<string, any>;
    flows: any[];
    constructor();
    rule: string;
    setState(name: string, value: any): void;
    setRules(rules: IMap<string, RuleRecord>): void;
    testRule(rule: RuleRecord): boolean;
    getNewActionsFrom(acts: ActionType[], cardId: string): ActionRecord[];
    getNextActions(actionType: string, actionData: any, actionCardId: string, card: CardRecord, root: CardRecord): Promise<ActionRecord[]>;
    getContent(actionType: string, actionData: any, card: CardRecord, root: CardRecord): Promise<string[]>;
}
declare const _default: RuleManager;
export default _default;
