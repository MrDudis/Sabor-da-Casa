import db from "../db.js";

import Card from "../../models/Card.js";

export async function upsert(card) {
    
    const query = `
        INSERT INTO cartao (id, id_pessoa)
        VALUES (?, ?)
        ON CONFLICT (id) DO UPDATE SET id_pessoa = ?, data_edicao = CURRENT_TIMESTAMP
    `;

    return new Promise((resolve, reject) => {

        db.run(query, [card.id, card.userId, card.userId], function (error) {

            if (error) {
                console.log(error);
                resolve(false);
            } else {
                resolve(true);
            };

        });

    });

};

export async function get(id) {

    const query = `
        SELECT *
        FROM cartao
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {

        db.get(query, [id], (error, row) => {
            if (error) {
                console.log(error);
                resolve(null);
            } else if (row) {
                resolve(new Card(row));
            } else {
                resolve(null);
            }
        });

    });


};

export async function getCardsByUserId(userId) {

    const query = `
        SELECT *
        FROM cartao
        WHERE id_pessoa = ?
    `;

    return new Promise((resolve, reject) => {

        db.all(query, [userId], (error, rows) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (rows) {
                resolve(rows.map(row => new Card(row)));
            } else {
                resolve(null);
            };

        });

    });

};

export async function getAll() {

    const query = `
        SELECT *
        FROM cartao
    `;

    return new Promise((resolve, reject) => {

        db.all(query, (error, rows) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (rows) {
                resolve(rows.map(row => new Card(row)));
            } else {
                resolve(null);
            };

        });

    });

};

export async function deleteCard(id) {

    const query = `
        DELETE FROM cartao
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