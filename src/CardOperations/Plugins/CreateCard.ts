import CardOperation from '../CardOperation';
import * as shortid from 'shortid';
import CardList from '../../CardList';
import { ActionRecord, CardRecord } from 'pmpos-models';

export default class CreateCard extends CardOperation {
    constructor() {
        super('CREATE_CARD', 'Create Card');
    }

    canEdit(action: ActionRecord): boolean {
        return false;
    }

    canApply(card: CardRecord, data: any): boolean {
        return data.id;
    }

    readConcurrencyData(card: CardRecord, actionData: any) {
        return undefined;
    }

    reduce(card: CardRecord, data: any): CardRecord {
        let { id, typeId, type, time } = data;

        let result = new CardRecord({ id, typeId, type, time });
        if (card.id && card.id !== '0') {
            result = card.update('cards', map => map.set(result.id, result));
        }
        return result;
    }

    fixData(data: any) {
        if (!data.id) {
            data.id = shortid.generate();
        }
        if (!data.typeId) {
            if (data.type) {
                data.typeId = CardList.getCardTypeIdByRef(data.type);
            }
        }
        if (!data.time || data.time === 0) {
            data.time = new Date().getTime();
        }
        return data;
    }

    processPendingAction(action: ActionRecord): ActionRecord {
        return action;
    }
}