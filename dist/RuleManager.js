var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as shortid from 'shortid';
import * as _ from 'lodash';
import { cardOperations } from './CardOperations/index';
import * as Nools from './lib/nools-ts.min';
import CardList from './CardList';
import { CardRecord, ActionRecord } from 'pmpos-models';
var ActionType = /** @class */ (function () {
    function ActionType(type, data) {
        this.type = type;
        this.data = data || {};
        this.params = this.data.params;
    }
    return ActionType;
}());
export { ActionType };
var ActionData = /** @class */ (function () {
    function ActionData(action, card, root, state) {
        this.action = action;
        this.card = card;
        this.root = root;
        this.state = state;
    }
    ActionData.prototype.load = function (cardType, cardName) {
        return CardList.getCardByName(cardType, cardName);
    };
    ActionData.prototype.count = function (cardType) {
        return CardList.getCount(cardType);
    };
    ActionData.prototype.padStart = function (val, count, ch) {
        return _.padStart(val, count, ch);
    };
    return ActionData;
}());
var ResultType = /** @class */ (function () {
    function ResultType() {
        this.actions = [];
    }
    ResultType.prototype.clear = function () {
        while (this.actions.length > 0) {
            this.actions.pop();
        }
    };
    ResultType.prototype.add = function (type, data) {
        this.actions.push(new ActionType(type, data));
    };
    return ResultType;
}());
var ContentType = /** @class */ (function () {
    function ContentType() {
        this.lines = [];
    }
    ContentType.prototype.clear = function () {
        while (this.lines.length > 0) {
            this.lines.pop();
        }
    };
    ContentType.prototype.add = function (line) {
        this.lines.push(line);
    };
    return ContentType;
}());
var RuleManager = /** @class */ (function () {
    function RuleManager() {
        this.rule = "\n    rule test {\n        when {\n            a : Action a.type == 'EXECUTE_COMMAND' && a.data.name == 'TEST';\n        }\n        then {\n            r.push(new Action('SET_CARD_TAG',{name:'Test',value:'0000'}))\n        }\n    }\n    ";
        this.state = new Map();
        this.flows = [];
    }
    RuleManager.prototype.setState = function (name, value) {
        this.state = this.state.set(name, value);
    };
    RuleManager.prototype.setRules = function (rules) {
        var _this = this;
        var defines = new Map();
        defines.set('State', ActionData);
        defines.set('Action', ActionType);
        defines.set('Result', ResultType);
        defines.set('Content', ContentType);
        defines.set('Card', CardRecord);
        var filteredRules = rules
            .filter(function (x) { return !x.name.startsWith('_') && x.content.includes('when'); })
            .valueSeq().toArray().filter(function (rule) { return _this.testRule(rule); });
        this.flows = filteredRules.map(function (rule) {
            var compiled = Nools.compile(rule.content, {
                define: defines
            });
            return compiled;
        });
    };
    RuleManager.prototype.testRule = function (rule) {
        try {
            var defines = new Map();
            defines.set('State', ActionData);
            defines.set('Action', ActionType);
            defines.set('Result', ResultType);
            defines.set('Content', ContentType);
            defines.set('Card', CardRecord);
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
    };
    RuleManager.prototype.getNewActionsFrom = function (acts, cardId) {
        var actions = [];
        var lastCardId = cardId;
        for (var _i = 0, acts_1 = acts; _i < acts_1.length; _i++) {
            var act = acts_1[_i];
            var processedData = cardOperations.fixData(act.type, __assign({}, act.data));
            if (!processedData.id) {
                processedData.id = shortid.generate();
            }
            actions.push(new ActionRecord({
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
    };
    RuleManager.prototype.getNextActions = function (actionType, actionData, actionCardId, card, root) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var promises = _this.flows.map(function (flow) { return __awaiter(_this, void 0, void 0, function () {
                            var result, session;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        result = new ResultType();
                                        session = flow.getSession(new ActionData(new ActionType(actionType, actionData), card, root, this.state), result);
                                        return [4 /*yield*/, session.match()];
                                    case 1:
                                        _a.sent();
                                        session.dispose();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); });
                        Promise.all(promises).then(function (results) {
                            var result = results.reduce(function (r, a) { return r.concat(a.actions); }, []);
                            resolve(_this.getNewActionsFrom(result, actionCardId));
                        });
                    })];
            });
        });
    };
    RuleManager.prototype.getContent = function (actionType, actionData, card, root) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var promises = _this.flows.map(function (flow) { return __awaiter(_this, void 0, void 0, function () {
                            var result, session;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        result = new ContentType();
                                        session = flow.getSession(new ActionData(new ActionType(actionType, actionData), card, root, this.state), result);
                                        return [4 /*yield*/, session.match()];
                                    case 1:
                                        _a.sent();
                                        session.dispose();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); });
                        Promise.all(promises).then(function (results) {
                            var result = results.reduce(function (r, a) { return r.concat(a.lines); }, []);
                            resolve(result);
                        });
                    })];
            });
        });
    };
    return RuleManager;
}());
export { RuleManager };
export default new RuleManager();
//# sourceMappingURL=RuleManager.js.map