import db from "../db.js";

import Product from "@/models/Product.js";

export async function getAll() {

    const query = `
        SELECT *
        FROM produto
    `;

    return new Promise((resolve, reject) => {

        db.all(query, (error, rows) => {
            if (rows) {
                resolve(rows.map(row => new Product(row)));
            } else {
                resolve(null);
            }
        });

    });

};