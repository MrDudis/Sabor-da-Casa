import db from "../db.js";

import User from "@/models/User.js";

import hashSHA256 from "@/utils/hash.js";

export async function updateUser(user) {

    const query = `
        UPDATE pessoa
        SET nome = ?, cpf = ?, email = ?, telefone = ?, data_nasc = ?, sexo = ?
        WHERE id = ?
    `;
    
    return new Promise((resolve, reject) => {
        
        db.run(query, [user.name, user.cpf, user.email, user.phone, user.birthdate, user.gender, user.id], (error) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else {
                resolve(new User(user));
            };

        });

    });

};

export async function updatePassword(user, newPassword) {

    const query = `
        UPDATE pessoa
        SET senha = ?
        WHERE id = ?
    `;

    const hashedPassword = hashSHA256(newPassword);

    return new Promise((resolve, reject) => {

        db.run(query, [hashedPassword, user.id], (error) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else {
                resolve(new User(user));
            };

        });

    });

};