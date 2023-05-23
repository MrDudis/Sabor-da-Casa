import db from "../db.js";

export async function getUserIdByToken(token) {

    const query = `
        SELECT id_pessoa
        FROM tokens
        WHERE token = ?
        LIMIT 1
    `;

    return new Promise((resolve, reject) => {

        db.get(query, [token], (error, row) => {
            if (row?.id_pessoa) {
                resolve(row.id_pessoa);
            } else {
                resolve(null);
            }
        });

    });

};