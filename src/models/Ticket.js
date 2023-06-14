import User from "./User.js";

export default class Ticket {

    constructor(data) {
        this.id = data.id;
        this._patch(data);
    };

    _patch(data) {

        if (data.id) {
            this.id = data.id;
        } else {
            this.id ??= null;
        };

        if (data.id_cliente) {
            this.userId = data.id_cliente;
        } else if (data.userId) {
            this.userId = data.userId;
        } else {
            this.userId ??= null;
        };

        if (data.user != null) {
            this.user = new User(data.user);
        };

        if (data.id_funcionario) {
            this.employeeId = data.id_funcionario;
        } else if (data.employeeId) {
            this.employeeId = data.employeeId;
        } else {
            this.employeeId ??= null;
        };

        if (data.employee != null) {
            this.employee = new User(data.employee);
        };

        if (data.ativa) {
            this.active = data.ativa;
        } else if (data.active) {
            this.active = data.active;
        } else {
            this.active ??= null;
        };

        if (data.products) {
            this.products = data.products;
        } else {
            this.products ??= [];
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

    }

}