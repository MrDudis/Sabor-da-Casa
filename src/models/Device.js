import User from "./User.js";

export default class Device {

    constructor(data) {
        this.id = data.id;
        this._patch(data);
    };

    _patch(data) {

        if ("id" in data) {
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

        if ("name" in data) {
            this.name = data.name;
        } else if ("nome" in data) {
            this.name = data.nome;
        } else {
            this.name ??= null;
        };

        if (data.user != null) {
            this.user = new User(data.user);
        };

    };

};