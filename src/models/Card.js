export default class Card {

    constructor(data) {

        this.id = data.id;
        this._patch(data);

    };

    _patch(data) {

        if ("cardId" in data) {
            this.id = data.cardId;
        } else if ("id" in data) {
            this.id = data.id;
        } else {
            this.id ??= null;
        };

        if ("userId" in data) {
            this.userId = data.userId;
        } else if ("id_pessoa" in data) {
            this.userId = data.id_pessoa;
        } else {
            this.userId ??= null;
        };

    };

};