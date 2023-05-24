export default class Product {

    constructor(data) {
        this.id = data.id;
        this.patch(data);
    };

    patch(data) {

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

        if (data.preco || data.price) {
            this.price = data.preco || data.price;
        } else {
            this.price ??= null;
        };

        if (data.estoque || data.stock) {
            this.stock = data.estoque || data.stock;
        } else {
            this.stock ??= null;
        };

    }

}