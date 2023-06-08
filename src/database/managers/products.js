import db from "../db.js";

import Product from "../../models/Product.js";

export async function insert(product) {

    const query = `
        INSERT INTO produto (nome, descricao, imagem, preco, estoque)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {

        db.run(query, [product.name, product.description, product.image, product.price, product.stock], function (error) {

            if (error) {
                console.log(error);
                resolve(null);
            } else {
                resolve(this.lastID);
            };

        });

    });

};

export async function get(id) {

    const query = `
        SELECT *
        FROM produto
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {

        db.get(query, [id], (error, row) => {
            if (row) {
                resolve(new Product(row));
            } else {
                resolve(null);
            }
        });

    });

};

export async function getAll() {

    const query = `
        SELECT *
        FROM produto
    `;

    return new Promise((resolve, reject) => {

        db.all(query, (error, rows) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (rows) {
                resolve(rows.map(row => new Product(row)));
            } else {
                resolve(null);
            };

        });

    });

};

export async function update(product) {

    const query = `
        UPDATE produto
        SET nome = ?, descricao = ?, imagem = ?, preco = ?, estoque = ?, data_edicao = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    
    return new Promise((resolve, reject) => {
        
        db.run(query, [product.name, product.description, product.image, product.price, product.stock, product.id], (error) => {

            if (error) {
                console.log(error);
                resolve(false);
            } else {
                resolve(true);
            };
            
        });

    });

};

export async function deleteProduct(id) {

    const query = `
        DELETE FROM produto
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {

        db.run(query, [id], function (error) {

            if (error) {
                console.log(error);
                resolve(false);
            } else {
                resolve(true);
            };

        });

    });

};