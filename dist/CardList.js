import { List, Map as IMap, Set as ISet } from 'immutable';
import { CardRecord, CardTypeRecord, CardTagData, makeDeepCommit } from 'pmpos-models';
import { cardOperations } from './CardOperations/index';
var CardList = /** @class */ (function () {
    function CardList() {
        var _this = this;
        this.actionReduce = function (card, action) {
            return _this.applyAction(card, action);
        };
        this.commitReduce = function (card, commit) {
            var result = commit.actions.reduce(_this.actionReduce, card);
            _this.otherIndex = _this.otherIndex.update(result.typeId, function (set) {
                if (!set) {
                    set = ISet();
                }
                return set.add(result.id);
            });
            return result;
        };
        this.commits = IMap();
        this.cards = IMap();
        this.cardTypes = IMap();
        this.tagTypes = IMap();
        this.otherIndex = IMap();
    }
    CardList.prototype.setCardTypes = function (cardTypes) {
        this.cardTypes = cardTypes;
    };
    CardList.prototype.setTagTypes = function (tagTypes) {
        this.tagTypes = tagTypes;
    };
    CardList.prototype.readConcurrencyData = function (actionType, card, actionData) {
        return cardOperations.getConcurrencyData(actionType, card, actionData);
    };
    CardList.prototype.applyAction = function (card, action, executeRules) {
        if (card === void 0) { card = new CardRecord(); }
        if (executeRules === void 0) { executeRules = false; }
        if (cardOperations.canHandle(action)) {
            return cardOperations.reduce(card, action);
        }
        return card;
    };
    CardList.prototype.canApplyAction = function (card, action) {
        return cardOperations.canApplyAction(card, action);
    };
    CardList.prototype.addCommits = function (commits) {
        for (var _i = 0, commits_1 = commits; _i < commits_1.length; _i++) {
            var commit = commits_1[_i];
            this.addCommit(commit);
        }
    };
    CardList.prototype.getCards = function () {
        return this.cards;
    };
    CardList.prototype.getCardTypes = function () {
        return this.cardTypes;
    };
    CardList.prototype.reduceTags = function (card, list, filters) {
        var _this = this;
        var foundTags = card.getTags(filters);
        list = list.merge(foundTags.result
            .map(function (ft) { return new CardTagData(foundTags.filter, ft, card); }));
        return card.cards.reduce(function (r, c) { return _this.reduceTags(c, r, filters); }, list);
    };
    CardList.prototype.getTags = function (filters) {
        return this.getTagsFrom(filters, this.cards);
    };
    CardList.prototype.getTagsFrom = function (filters, cards) {
        var _this = this;
        return cards.reduce(function (r, card) { return _this.reduceTags(card, r, filters); }, List());
    };
    CardList.prototype.getCardsByType = function (typeId) {
        var _this = this;
        if (typeId && this.otherIndex) {
            var index = this.otherIndex.get(typeId);
            if (index) {
                return index.toList()
                    .map(function (id) { return _this.cards.get(id); })
                    .sortBy(function (x) { return -x.time; })
                    || List();
            }
        }
        return List();
    };
    CardList.prototype.getCardTypeIdByRef = function (ref) {
        var ct = this.getCardTypeByRef(ref);
        if (ct) {
            return ct.id;
        }
        return '';
    };
    CardList.prototype.getCardTypeByRef = function (ref) {
        var ct = this.cardTypes.find(function (x) { return x.reference === ref || x.name === ref; });
        return ct;
    };
    CardList.prototype.getCardType = function (id) {
        return this.cardTypes.get(id);
    };
    CardList.prototype.getRootCardTypes = function () {
        var sc = this.getSubCardTypes();
        return this.cardTypes
            .valueSeq()
            .filter(function (x) { return sc.indexOf(x.id) === -1; })
            .map(function (x) { return x.name; })
            .sortBy(function (x) { return x; })
            .toArray();
    };
    CardList.prototype.getSubCardTypes = function () {
        var _this = this;
        var result = ISet();
        result = this.cardTypes.reduce(function (r, ct) { return _this.pushSubCardTypes(ct, r); }, result);
        return result.toArray();
    };
    CardList.prototype.pushSubCardTypes = function (cardType, result) {
        var _this = this;
        var subCards = cardType.subCardTypes
            .filter(function (x) { return _this.cardTypes.has(x) && !result.has(x); })
            .map(function (x) { return _this.getCardType(x); });
        result = result.concat(subCards.map(function (x) { return x.id; }));
        result = subCards.reduce(function (r, ct) { return _this.pushSubCardTypes(ct, r); }, result);
        return result;
    };
    CardList.prototype.getCard = function (id) {
        return this.cards.get(id);
    };
    CardList.prototype.getCardByName = function (type, name) {
        var ctId = this.getCardTypeIdByRef(type);
        return this.getCardsByType(ctId).find(function (c) { return c.hasTag('Name', name); });
    };
    CardList.prototype.getCommits = function (id) {
        return this.commits.get(id);
    };
    CardList.prototype.findCards = function (cardType, value) {
        var _this = this;
        var inputValue = value.toLowerCase();
        var index = this.otherIndex.get(cardType.id) || ISet();
        var resultItems = [];
        index.toList().every(function (i) {
            var card = _this.cards.get(i);
            if (card.name.toLowerCase().includes(inputValue)) {
                resultItems.push(card);
            }
            return resultItems.length < 100 || inputValue.length > 2;
        });
        return resultItems.sort(function (a, b) { return _this.sort(a, b, inputValue); });
    };
    CardList.prototype.sort = function (a, b, compare) {
        var first = a.name.toLowerCase();
        var second = b.name.toLowerCase();
        if (first.startsWith(compare) && !second.startsWith(compare)) {
            return -1;
        }
        if (!first.startsWith(compare) && second.startsWith(compare)) {
            return 1;
        }
        if (first > second) {
            return 1;
        }
        if (first < second) {
            return -1;
        }
        return 0;
    };
    CardList.prototype.getCardSuggestions = function (ref, value) {
        var inputLength = value.length;
        if (inputLength === 0 || !ref) {
            return [];
        }
        var cardType = this.cardTypes
            .find(function (x) { return x.reference === ref; }) || new CardTypeRecord();
        var result = [];
        if (cardType.name) {
            result = this.findCards(cardType, value)
                .map(function (r) { return { label: r.name }; });
        }
        return result;
    };
    CardList.prototype.getTagSortIndexByCard = function (card, tag) {
        var ct = this.getCardType(card.typeId);
        var result = ct ? ct.tagTypes.indexOf(tag.typeId) : -1;
        if (result === -1) {
            result = 99999;
        }
        return result;
    };
    CardList.prototype.getCount = function (cardType) {
        var cti = this.getCardTypeIdByRef(cardType);
        var index = this.otherIndex.get(cti);
        return index ? index.count() : 0;
    };
    CardList.prototype.addCommit = function (commit) {
        var _this = this;
        this.commits = this.commits.update(commit.cardId, function (list) {
            if (!list) {
                list = List();
            }
            return list.push(makeDeepCommit(commit));
        });
        this.cards = this.cards.update(commit.cardId, function (cardRecord) {
            var commits = _this.commits.get(commit.cardId);
            return commits
                .sortBy(function (x) { return x.time; })
                .reduce(_this.commitReduce, new CardRecord());
        });
    };
    return CardList;
}());
export { CardList };
export default new CardList();
//# sourceMappingURL=CardList.js.map