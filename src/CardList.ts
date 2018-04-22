import { List, Map as IMap, Set as ISet } from 'immutable';
import {
    CommitRecord, Commit, CardRecord, CardTypeRecord, TagTypeRecord, ActionRecord,
    CardTagData, CardTagRecord, makeDeepCommit
} from 'pmpos-models';
import { cardOperations } from './CardOperations/index';

export class CardList {

    commits: IMap<string, List<CommitRecord>>;
    cards: IMap<string, CardRecord>;
    cardTypes: IMap<string, CardTypeRecord>;
    tagTypes: IMap<string, TagTypeRecord>;
    otherIndex: IMap<string, ISet<string>>;

    constructor() {
        this.commits = IMap<string, List<CommitRecord>>();
        this.cards = IMap<string, CardRecord>();
        this.cardTypes = IMap<string, CardTypeRecord>();
        this.tagTypes = IMap<string, TagTypeRecord>();
        this.otherIndex = IMap<string, ISet<string>>();
    }

    setCardTypes(cardTypes: IMap<string, CardTypeRecord>) {
        this.cardTypes = cardTypes;
    }

    setTagTypes(tagTypes: IMap<string, TagTypeRecord>) {
        this.tagTypes = tagTypes;
    }

    readConcurrencyData(actionType: string, card: CardRecord, actionData: any): any {
        return cardOperations.getConcurrencyData(actionType, card, actionData);
    }

    applyAction(card: CardRecord = new CardRecord(), action: ActionRecord, executeRules: boolean = false): CardRecord {
        if (cardOperations.canHandle(action)) {
            return cardOperations.reduce(card, action);
        }
        return card;
    }

    canApplyAction(card: CardRecord, action: ActionRecord): boolean {
        return cardOperations.canApplyAction(card, action);
    }

    actionReduce = (card: CardRecord, action: ActionRecord) => {
        return this.applyAction(card, action);
    }

    commitReduce = (card: CardRecord, commit: CommitRecord) => {
        let result = commit.actions.reduce(this.actionReduce, card);
        this.otherIndex = this.otherIndex.update(result.typeId, set => {
            if (!set) { set = ISet<string>(); }
            return set.add(result.id);
        });
        return result;
    }

    addCommits(commits: Commit[]) {
        for (const commit of commits) {
            this.addCommit(commit);
        }
    }

    getCards(): IMap<string, CardRecord> {
        return this.cards;
    }

    getCardTypes(): IMap<string, CardTypeRecord> {
        return this.cardTypes;
    }

    reduceTags(card: CardRecord, list: List<CardTagData>, filters: string[]) {
        let foundTags = card.getTags(filters);
        list = list.merge(foundTags.result
            .map(ft => { return new CardTagData(foundTags.filter, ft, card); }));
        return card.cards.reduce((r, c) => this.reduceTags(c, r, filters), list);
    }

    getTags(filters: string[]): List<CardTagData> {
        return this.getTagsFrom(filters, this.cards);
    }

    getTagsFrom(filters: string[], cards: IMap<string, CardRecord>): List<CardTagData> {
        return cards.reduce((r, card) => this.reduceTags(card, r, filters), List<CardTagData>());
    }

    getCardsByType(typeId: string): List<CardRecord> {
        if (typeId && this.otherIndex) {
            let index = this.otherIndex.get(typeId);
            if (index) {
                return index.toList()
                    .map(id => this.cards.get(id) as CardRecord)
                    .sortBy(x => -x.time)
                    || List<CardRecord>();
            }
        }
        return List<CardRecord>();
    }

    getCardTypeIdByRef(ref: string): string {
        let ct = this.getCardTypeByRef(ref);
        if (ct) { return ct.id; }
        return '';
    }

    getCardTypeByRef(ref: string): CardTypeRecord | undefined {
        let ct = this.cardTypes.find(x => x.reference === ref || x.name === ref);
        return ct;
    }

    getCardType(id: string): CardTypeRecord | undefined {
        return this.cardTypes.get(id);
    }

    getRootCardTypes(): string[] {
        let sc = this.getSubCardTypes();
        return this.cardTypes
            .valueSeq()
            .filter(x => sc.indexOf(x.id) === -1)
            .map(x => x.name)
            .sortBy(x => x)
            .toArray();
    }

    private getSubCardTypes(): string[] {
        let result: ISet<string> = ISet<string>();
        result = this.cardTypes.reduce((r, ct) => this.pushSubCardTypes(ct, r), result);
        return result.toArray();
    }

    private pushSubCardTypes(cardType: CardTypeRecord, result: ISet<string>): ISet<string> {
        let subCards = cardType.subCardTypes
            .filter(x => this.cardTypes.has(x) && !result.has(x))
            .map(x => this.getCardType(x) as CardTypeRecord);
        result = result.concat(subCards.map(x => x.id));
        result = subCards.reduce((r, ct) => this.pushSubCardTypes(ct, r), result);
        return result;
    }

    getCard(id: string): CardRecord {
        return this.cards.get(id) as CardRecord;
    }

    getCardByName(type: string, name: string): CardRecord | undefined {
        let ctId = this.getCardTypeIdByRef(type);
        return this.getCardsByType(ctId).find(c => c.hasTag('Name', name)) as CardRecord;
    }

    getCommits(id: string): List<CommitRecord> | undefined {
        return this.commits.get(id);
    }

    findCards(cardType: CardTypeRecord, value: string, showAllCards: boolean = false): CardRecord[] {
        const inputValue = value.toLowerCase();
        let index = this.otherIndex.get(cardType.id) || ISet<string>();
        let resultItems: CardRecord[] = [];
        index.toArray().every(i => {
            let card = this.cards.get(i) as CardRecord;
            if ((showAllCards || !card.isClosed) && card.includes(inputValue)) {
                resultItems.push(card);
            }
            return resultItems.length < 100 || inputValue.length > 3;
        });
        return resultItems.sort((a, b) => this.sort(a, b, inputValue));
    }

    sort(a: CardRecord, b: CardRecord, compare: string): number {
        let first = a.name.toLowerCase();
        let second = b.name.toLowerCase();
        if (first.startsWith(compare) && !second.startsWith(compare)) { return -1; }
        if (!first.startsWith(compare) && second.startsWith(compare)) { return 1; }
        if (first > second) { return 1; }
        if (first < second) { return -1; }
        return 0;
    }

    getCardSuggestions(ref: string, value: string): { label: string }[] {
        const inputLength = value.length;
        if (inputLength === 0 || !ref) { return []; }
        let cardType = this.cardTypes
            .find(x => x.reference === ref) || new CardTypeRecord();
        let result = [] as { label: string }[];
        if (cardType.name) {
            result = this.findCards(cardType, value)
                .map(r => { return { label: r.name }; });
        }
        return result;
    }

    getTagSortIndexByCard(card: CardRecord, tag: CardTagRecord): number {
        let ct = this.getCardType(card.typeId);
        let result = ct ? ct.tagTypes.indexOf(tag.typeId) : -1;
        if (result === -1) { result = 99999; }
        return result;
    }

    getCount(cardType: string) {
        let cti = this.getCardTypeIdByRef(cardType);
        let index = this.otherIndex.get(cti);
        return index ? index.count() : 0;
    }
    private addCommit(commit: Commit) {
        this.commits = this.commits.update(commit.cardId, list => {
            if (!list) { list = List<CommitRecord>(); }
            return list.push(makeDeepCommit(commit));
        });
        this.cards = this.cards.update(commit.cardId, cardRecord => {
            let commits = this.commits.get(commit.cardId) as List<CommitRecord>;
            return commits
                .sortBy(x => x.time)
                .reduce(this.commitReduce, new CardRecord());
        });
    }
}

export default new CardList();