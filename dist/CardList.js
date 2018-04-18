"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const pmpos_models_1 = require("pmpos-models");
const index_1 = require("./CardOperations/index");
class CardList {
    constructor() {
        this.actionReduce = (card, action) => {
            return this.applyAction(card, action);
        };
        this.commitReduce = (card, commit) => {
            let result = commit.actions.reduce(this.actionReduce, card);
            this.otherIndex = this.otherIndex.update(result.typeId, set => {
                if (!set) {
                    set = immutable_1.Set();
                }
                return set.add(result.id);
            });
            return result;
        };
        this.commits = immutable_1.Map();
        this.cards = immutable_1.Map();
        this.cardTypes = immutable_1.Map();
        this.tagTypes = immutable_1.Map();
        this.otherIndex = immutable_1.Map();
    }
    setCardTypes(cardTypes) {
        this.cardTypes = cardTypes;
    }
    setTagTypes(tagTypes) {
        this.tagTypes = tagTypes;
    }
    readConcurrencyData(actionType, card, actionData) {
        return index_1.cardOperations.getConcurrencyData(actionType, card, actionData);
    }
    applyAction(card = new pmpos_models_1.CardRecord(), action, executeRules = false) {
        if (index_1.cardOperations.canHandle(action)) {
            return index_1.cardOperations.reduce(card, action);
        }
        return card;
    }
    canApplyAction(card, action) {
        return index_1.cardOperations.canApplyAction(card, action);
    }
    addCommits(commits) {
        for (const commit of commits) {
            this.addCommit(commit);
        }
    }
    getCards() {
        return this.cards;
    }
    getCardTypes() {
        return this.cardTypes;
    }
    reduceTags(card, list, filters) {
        let foundTags = card.getTags(filters);
        list = list.merge(foundTags.result
            .map(ft => { return new pmpos_models_1.CardTagData(foundTags.filter, ft, card); }));
        return card.cards.reduce((r, c) => this.reduceTags(c, r, filters), list);
    }
    getTags(filters) {
        return this.getTagsFrom(filters, this.cards);
    }
    getTagsFrom(filters, cards) {
        return cards.reduce((r, card) => this.reduceTags(card, r, filters), immutable_1.List());
    }
    getCardsByType(typeId) {
        if (typeId && this.otherIndex) {
            let index = this.otherIndex.get(typeId);
            if (index) {
                return index.toList()
                    .map(id => this.cards.get(id))
                    .sortBy(x => -x.time)
                    || immutable_1.List();
            }
        }
        return immutable_1.List();
    }
    getCardTypeIdByRef(ref) {
        let ct = this.getCardTypeByRef(ref);
        if (ct) {
            return ct.id;
        }
        return '';
    }
    getCardTypeByRef(ref) {
        let ct = this.cardTypes.find(x => x.reference === ref || x.name === ref);
        return ct;
    }
    getCardType(id) {
        return this.cardTypes.get(id);
    }
    getRootCardTypes() {
        let sc = this.getSubCardTypes();
        return this.cardTypes
            .valueSeq()
            .filter(x => sc.indexOf(x.id) === -1)
            .map(x => x.name)
            .sortBy(x => x)
            .toArray();
    }
    getSubCardTypes() {
        let result = immutable_1.Set();
        result = this.cardTypes.reduce((r, ct) => this.pushSubCardTypes(ct, r), result);
        return result.toArray();
    }
    pushSubCardTypes(cardType, result) {
        let subCards = cardType.subCardTypes
            .filter(x => this.cardTypes.has(x) && !result.has(x))
            .map(x => this.getCardType(x));
        result = result.concat(subCards.map(x => x.id));
        result = subCards.reduce((r, ct) => this.pushSubCardTypes(ct, r), result);
        return result;
    }
    getCard(id) {
        return this.cards.get(id);
    }
    getCardByName(type, name) {
        let ctId = this.getCardTypeIdByRef(type);
        return this.getCardsByType(ctId).find(c => c.hasTag('Name', name));
    }
    getCommits(id) {
        return this.commits.get(id);
    }
    findCards(cardType, value) {
        const inputValue = value.toLowerCase();
        let index = this.otherIndex.get(cardType.id) || immutable_1.Set();
        let resultItems = [];
        index.toList().every(i => {
            let card = this.cards.get(i);
            if (card.name.toLowerCase().includes(inputValue)) {
                resultItems.push(card);
            }
            return resultItems.length < 100 || inputValue.length > 2;
        });
        return resultItems.sort((a, b) => this.sort(a, b, inputValue));
    }
    sort(a, b, compare) {
        let first = a.name.toLowerCase();
        let second = b.name.toLowerCase();
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
    }
    getCardSuggestions(ref, value) {
        const inputLength = value.length;
        if (inputLength === 0 || !ref) {
            return [];
        }
        let cardType = this.cardTypes
            .find(x => x.reference === ref) || new pmpos_models_1.CardTypeRecord();
        let result = [];
        if (cardType.name) {
            result = this.findCards(cardType, value)
                .map(r => { return { label: r.name }; });
        }
        return result;
    }
    getTagSortIndexByCard(card, tag) {
        let ct = this.getCardType(card.typeId);
        let result = ct ? ct.tagTypes.indexOf(tag.typeId) : -1;
        if (result === -1) {
            result = 99999;
        }
        return result;
    }
    getCount(cardType) {
        let cti = this.getCardTypeIdByRef(cardType);
        let index = this.otherIndex.get(cti);
        return index ? index.count() : 0;
    }
    addCommit(commit) {
        this.commits = this.commits.update(commit.cardId, list => {
            if (!list) {
                list = immutable_1.List();
            }
            return list.push(pmpos_models_1.makeDeepCommit(commit));
        });
        this.cards = this.cards.update(commit.cardId, cardRecord => {
            let commits = this.commits.get(commit.cardId);
            return commits
                .sortBy(x => x.time)
                .reduce(this.commitReduce, new pmpos_models_1.CardRecord());
        });
    }
}
exports.CardList = CardList;
exports.default = new CardList();
//# sourceMappingURL=CardList.js.map