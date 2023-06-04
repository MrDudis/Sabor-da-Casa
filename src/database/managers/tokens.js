import db from "../db.js";

import { generateToken } from "../../utils/token.js";

export async function insert(id_pessoa) {

    const query = `
        INSERT INTO 
        tokens (token, id_pessoa) 
        VALUES (?, ?)
    `;

    let token = generateToken();
    
    return new Promise((resolve, reject) => {

        db.run(query, [token, id_pessoa], (error) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else {
                resolve(token);
            };

        });

    });

};

export async function get(token) {

    const query = `
        SELECT id_pessoa
        FROM tokens
        WHERE token = ?
        LIMIT 1
    `;

    return new Promise((resolve, reject) => {

        db.get(query, [token], (error, row) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (row?.id_pessoa) {
                resolve(row.id_pessoa);
            } else {
                resolve(null);
            };

        });

    });

};

export async function deleteToken(token) {

    const query = `
        DELETE FROM tokens
        WHERE token = ?
    `;

    return new Promise((resolve, reject) => {

        db.run(query, [token], (error) => {

            if (error) {
                console.log(error);
                resolve(false);
            } else {
                resolve(true);
            };
            
        });

    });

};