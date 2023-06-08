export default class Product {

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

        if (data.nome || data.name) {
            this.name = data.nome || data.name;
        } else {
            this.name ??= null;
        };

        if (data.descricao || data.description) {
            this.description = data.descricao || data.description;
        } else {
            this.description ??= null;
        };

        if (data.imagem || data.image) {
            this.image = data.imagem || data.image;
        } else {
            this.image ??= null;
        };

        if ("preco" in data) {
            this.price = data.preco;
        } else if ("price" in data) {
            this.price = data.price;
        } else {
            this.price ??= null;
        };

        if ("estoque" in data) {
            this.stock = data.estoque;
        } else if ("stock" in data) {
            this.stock = data.stock;
        } else if ("quantity" in data) {
            this.stock = data.quantity;
        } else {
            this.stock ??= null;
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