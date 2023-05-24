import db from "../db.js";

import hashSHA256 from "@/utils/hash.js";

export async function validatePassword(user, password) {

    const query = `
        SELECT id
        FROM pessoa
        WHERE id = ? AND senha = ?
        LIMIT 1
    `;

    const hashedPassword = hashSHA256(password);

    return new Promise((resolve, reject) => {
    
        db.get(query, [user.id, hashedPassword], (error, row) => {
            if (row) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

    });


};