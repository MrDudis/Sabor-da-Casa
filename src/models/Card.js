import User from "./User.js";

export default class Card {

    constructor(data) {

        this.id = data?.id;
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

        if (data.user != null) {
            this.user = new User(data.user);
        };

        if ("data_criacao" in data) {
            this.createdAt = data.data_criacao;
        } else if ("createdAt" in data) {
            this.createdAt = data.createdAt;
        } else {
            this.createdAt ??= null;
        };

        if ("data_edicao" in data) {
            this.updatedAt = data.data_edicao;
        } else if ("updatedAt" in data) {
            this.updatedAt = data.updatedAt;
        } else {
            this.updatedAt ??= null;
        };

    };

};