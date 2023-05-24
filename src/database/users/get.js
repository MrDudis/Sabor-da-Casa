import db from "../db.js";

import User from "@/models/User.js";

import hashSHA256 from "@/utils/hash.js";

export async function getById(id) {

    const query = `
        SELECT p.*, c.id_pessoa AS cliente_id, f.id_pessoa AS funcionario_id, g.id_pessoa AS gerente_id, a.id_pessoa AS administrador_id
        FROM pessoa p
        LEFT JOIN cliente c ON p.id = c.id_pessoa
        LEFT JOIN funcionario f ON p.id = f.id_pessoa
        LEFT JOIN gerente g ON p.id = g.id_pessoa
        LEFT JOIN administrador a ON p.id = a.id_pessoa
        WHERE p.id = ?
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
        SELECT p.*, c.id_pessoa AS cliente_id, f.id_pessoa AS funcionario_id, g.id_pessoa AS gerente_id, a.id_pessoa AS administrador_id
        FROM pessoa p
        LEFT JOIN cliente c ON p.id = c.id_pessoa
        LEFT JOIN funcionario f ON p.id = f.id_pessoa
        LEFT JOIN gerente g ON p.id = g.id_pessoa
        LEFT JOIN administrador a ON p.id = a.id_pessoa
        WHERE (p.email = ? OR p.cpf = ?) AND p.senha = ?
        LIMIT 1
    `;

    const hashedPassword = hashSHA256(password);

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