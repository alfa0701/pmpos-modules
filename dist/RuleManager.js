"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const shortid = require("shortid");
const _ = require("lodash");
const index_1 = require("./CardOperations/index");
const Nools = require("nools-ts");
const CardList_1 = require("./CardList");
const pmpos_models_1 = require("pmpos-models");
class ActionType {
    constructor(type, data) {
        this.type = type;
        this.data = data || {};
        this.params = this.data.params;
    }
}
exports.ActionType = ActionType;
class ActionData {
    constructor(action, card, root, state) {
        this.action = action;
        this.card = card;
        this.root = root;
        this.state = state;
    }
    load(cardType, cardName) {
        return CardList_1.default.getCardByName(cardType, cardName);
    }
    count(cardType) {
        return CardList_1.default.getCount(cardType);
    }
    padStart(val, count, ch) {
        return _.padStart(val, count, ch);
    }
}
class ResultType {
    constructor() {
        this.actions = [];
    }
    clear() {
        while (this.actions.length > 0) {
            this.actions.pop();
        }
    }
    add(type, data) {
        this.actions.push(new ActionType(type, data));
    }
}
class ContentType {
    constructor() {
        this.lines = [];
    }
    clear() {
        while (this.lines.length > 0) {
            this.lines.pop();
        }
    }
    add(line) {
        this.lines.push(line);
    }
}
class RuleManager {
    constructor() {
        this.rule = `
    rule test {
        when {
            a : Action a.type == 'EXECUTE_COMMAND' && a.data.name == 'TEST';
        }
        then {
            r.push(new Action('SET_CARD_TAG',{name:'Test',value:'0000'}))
        }
    }
    `;
        this.state = new Map();
        this.flows = [];
    }
    setState(name, value) {
        this.state = this.state.set(name, value);
    }
    setRules(rules) {
        const defines = new Map();
        defines.set('State', ActionData);
        defines.set('Action', ActionType);
        defines.set('Result', ResultType);
        defines.set('Content', ContentType);
        defines.set('Card', pmpos_models_1.CardRecord);
        let filteredRules = rules
            .filter(x => !x.name.startsWith('_') && x.content.includes('when'))
            .valueSeq().toArray().filter(rule => this.testRule(rule));
        this.flows = filteredRules.map(rule => {
            let compiled = Nools.compile(rule.content, {
                define: defines
            });
            return compiled;
        });
    }
    testRule(rule) {
        try {
            const defines = new Map();
            defines.set('State', ActionData);
            defines.set('Action', ActionType);
            defines.set('Result', ResultType);
            defines.set('Content', ContentType);
            defines.set('Card', pmpos_models_1.CardRecord);
            Nools.compile(rule.content, {
                define: defines,
                scope: new Map([['r', []]])
            });
            return true;
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.log('error creating rule ' + rule.name, error);
            return false;
        }
    }
    getNewActionsFrom(acts, cardId) {
        let actions = [];
        let lastCardId = cardId;
        for (const act of acts) {
            let processedData = index_1.cardOperations.fixData(act.type, Object.assign({}, act.data));
            if (!processedData.id) {
                processedData.id = shortid.generate();
            }
            actions.push(new pmpos_models_1.ActionRecord({
                id: shortid.generate(),
                actionType: act.type,
                cardId: lastCardId,
                data: processedData
            }));
            if (act.type === 'CREATE_CARD' && processedData.id) {
                lastCardId = processedData.id;
            }
        }
        return actions;
    }
    getNextActions(actionType, actionData, actionCardId, card, root) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let promises = this.flows.map((flow) => __awaiter(this, void 0, void 0, function* () {
                    let result = new ResultType();
                    let session = flow.getSession(new ActionData(new ActionType(actionType, actionData), card, root, this.state), result);
                    yield session.match();
                    session.dispose();
                    return result;
                }));
                Promise.all(promises).then(results => {
                    let result = results.reduce((r, a) => r.concat(a.actions), []);
                    resolve(this.getNewActionsFrom(result, actionCardId));
                });
            });
        });
    }
    getContent(actionType, actionData, card, root) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let promises = this.flows.map((flow) => __awaiter(this, void 0, void 0, function* () {
                    let result = new ContentType();
                    let session = flow.getSession(new ActionData(new ActionType(actionType, actionData), card, root, this.state), result);
                    yield session.match();
                    session.dispose();
                    return result;
                }));
                Promise.all(promises).then(results => {
                    let result = results.reduce((r, a) => r.concat(a.lines), []);
                    resolve(result);
                });
            });
        });
    }
}
exports.RuleManager = RuleManager;
exports.default = new RuleManager();
//# sourceMappingURL=RuleManager.js.map