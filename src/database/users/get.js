import crypto from "crypto";

import db from "../db.js";
import User from "@/models/User.js";

function sha256Hash(input) {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
};

export async function getById(id) {

    const query = `
        SELECT *
        FROM pessoa
        WHERE id = ?
        LIMIT 1
    `;

    return new Promise((resolve, reject) => {

        db.get(query, [id], (error, row) => {
            if (row) {
                resolve(new User(row));
            } else {
                resolve(null);
            }
        });

    });

};

export async function getByCredentials(userinfo, password) {
    
    const query = `
        SELECT *
        FROM pessoa
        WHERE (email = ? OR cpf = ?) AND senha = ?
        LIMIT 1
    `;

    const hashedPassword = sha256Hash(password);

    return new Promise((resolve, reject) => {
    
        db.get(query, [userinfo, userinfo, hashedPassword], (error, row) => {
            if (row) {
                resolve(new User(row));
            } else {
                resolve(null);
            }
        });

    });

};