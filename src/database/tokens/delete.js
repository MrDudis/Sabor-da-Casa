import db from "../db.js";

export async function deleteToken(token) {

    const query = `
        DELETE FROM tokens
        WHERE token = ?
    `;

    return new Promise((resolve, reject) => {

        db.run(query, [token], (error) => {
            if (error) {
                resolve(false);
            } else {
                resolve(true);
            }
        });

    });

};