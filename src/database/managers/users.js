import db from "../db.js";

import User, { Role } from "../../models/User.js";

import { hashStringToSHA256 } from "../../utils/hash.js";

const rolesTable = {
    [Role.CUSTOMER]: "cliente",
    [Role.EMPLOYEE]: "funcionario",
    [Role.CASHIER]: "caixa",
    [Role.MANAGER]: "gerente",
    [Role.ADMIN]: "administrador"
};

export async function insert(user) {

    const query = `
        INSERT INTO pessoa (nome, cpf, email, telefone, data_nasc, sexo, senha)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const hashedPassword = hashStringToSHA256(user.password);

    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            db.run(query, [user.name, user.cpf, user.email, user.phone, user.birthdate, user.gender, hashedPassword], function(error) {
                if (error) {
                    console.log(error);
                    return resolve(null);
                };

                let userId = this.lastID;

                if (!userId) {
                    db.run("ROLLBACK");
                    return resolve(null);
                };
                
                let roleQuery = `
                    INSERT INTO ${rolesTable[user.role]} (id_pessoa)
                    VALUES (?)
                `;

                db.run(roleQuery, [userId], function(error) {
                    if (error) {
                        db.run("ROLLBACK");
                        console.log(error);
                        return resolve(null);
                    };

                    db.run("COMMIT");
                    return resolve(userId);
                });

            });

        });

    });

};

export async function getById(id) {

    const query = `
        SELECT p.*, c.id_pessoa AS cliente_id, f.id_pessoa AS funcionario_id, cx.id_pessoa AS caixa_id, g.id_pessoa AS gerente_id, a.id_pessoa AS administrador_id
        FROM pessoa p
        LEFT JOIN cliente c ON p.id = c.id_pessoa
        LEFT JOIN funcionario f ON p.id = f.id_pessoa
        LEFT JOIN caixa cx ON p.id = cx.id_pessoa
        LEFT JOIN gerente g ON p.id = g.id_pessoa
        LEFT JOIN administrador a ON p.id = a.id_pessoa
        WHERE p.id = ?
        LIMIT 1
    `;

    return new Promise((resolve, reject) => {

        db.get(query, [id], (error, row) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (row) {
                resolve(new User(row));
            } else {
                resolve(null);
            };

        });

    });

};

export async function getByCredentials(userinfo, password) {
    
    let query = `
        SELECT p.*, c.id_pessoa AS cliente_id, f.id_pessoa AS funcionario_id, cx.id_pessoa AS caixa_id, g.id_pessoa AS gerente_id, a.id_pessoa AS administrador_id
        FROM pessoa p
        LEFT JOIN cliente c ON p.id = c.id_pessoa
        LEFT JOIN funcionario f ON p.id = f.id_pessoa
        LEFT JOIN caixa cx ON p.id = cx.id_pessoa
        LEFT JOIN gerente g ON p.id = g.id_pessoa
        LEFT JOIN administrador a ON p.id = a.id_pessoa
        WHERE (p.email = ? OR p.cpf = ?) AND p.senha = ?
        LIMIT 1
    `;

    const hashedPassword = hashStringToSHA256(password);

    return new Promise((resolve, reject) => {
    
        db.get(query, [userinfo, userinfo, hashedPassword], (error, row) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (row) {
                resolve(new User(row));
            } else {
                resolve(null);
            };

        });

    });

};

export async function getByEmailOrCPF(email, cpf) {

    const query = `
        SELECT p.*, c.id_pessoa AS cliente_id, f.id_pessoa AS funcionario_id, cx.id_pessoa AS caixa_id, g.id_pessoa AS gerente_id, a.id_pessoa AS administrador_id
        FROM pessoa p
        LEFT JOIN cliente c ON p.id = c.id_pessoa
        LEFT JOIN funcionario f ON p.id = f.id_pessoa
        LEFT JOIN caixa cx ON p.id = cx.id_pessoa
        LEFT JOIN gerente g ON p.id = g.id_pessoa
        LEFT JOIN administrador a ON p.id = a.id_pessoa
        WHERE p.email = ? OR p.cpf = ?
        LIMIT 1
    `;

    return new Promise((resolve, reject) => {

        db.get(query, [email, cpf], (error, row) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (row) {
                resolve(new User(row));
            } else {
                resolve(null);
            };

        });

    });

};

export async function getAll() {

    const query = `
        SELECT p.*, c.id_pessoa AS cliente_id, f.id_pessoa AS funcionario_id, cx.id_pessoa AS caixa_id, g.id_pessoa AS gerente_id, a.id_pessoa AS administrador_id
        FROM pessoa p
        LEFT JOIN cliente c ON p.id = c.id_pessoa
        LEFT JOIN funcionario f ON p.id = f.id_pessoa
        LEFT JOIN caixa cx ON p.id = cx.id_pessoa
        LEFT JOIN gerente g ON p.id = g.id_pessoa
        LEFT JOIN administrador a ON p.id = a.id_pessoa
    `;

    return new Promise((resolve, reject) => {

        db.all(query, (error, rows) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (rows) {
                resolve(rows.map(row => new User(row)));
            } else {
                resolve(null);
            };

        });

    });

};

export async function update(user) {

    const query = `
        UPDATE pessoa
        SET nome = ?, cpf = ?, email = ?, telefone = ?, data_nasc = ?, sexo = ?, data_edicao = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            db.run(query, [user.name, user.cpf, user.email, user.phone, user.birthdate, user.gender, user.id], function(error) {
                if (error) {
                    console.log(error);
                    return resolve(false);
                };

                if (this.changes < 1) {
                    db.run("ROLLBACK");
                    return resolve(false);
                };

                let roleQuery = `
                    DELETE FROM ${rolesTable[user.role]}
                    WHERE id_pessoa = ?
                `

                db.run(roleQuery, [user.id], function(error) {
                    if (error) {
                        db.run("ROLLBACK");
                        console.log(error);
                        return resolve(false);
                    };

                    let roleQuery = `
                        INSERT INTO ${rolesTable[user.role]} (id_pessoa)
                        VALUES (?)
                    `;

                    db.run(roleQuery, [user.id], function(error) {
                        if (error) {
                            db.run("ROLLBACK");
                            console.log(error);
                            return resolve(false);
                        };

                        db.run("COMMIT");
                        return resolve(true);
                    });

                });

            });

        });

    });

};

export async function validatePassword(user, password) {

    const query = `
        SELECT id
        FROM pessoa
        WHERE id = ? AND senha = ?
        LIMIT 1
    `;

    const hashedPassword = hashStringToSHA256(password);

    return new Promise((resolve, reject) => {
    
        db.get(query, [user.id, hashedPassword], (error, row) => {

            if (error) {
                console.log(error);
                resolve(false);
            } else if (row) {
                resolve(true);
            } else {
                resolve(false);
            };

        });

    });


};

export async function updateUser(user) {

    const query = `
        UPDATE pessoa
        SET nome = ?, cpf = ?, email = ?, telefone = ?, data_nasc = ?, sexo = ?, data_edicao = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    
    return new Promise((resolve, reject) => {
        
        db.run(query, [user.name, user.cpf, user.email, user.phone, user.birthdate, user.gender, user.id], (error) => {

            if (error) {
                console.log(error);
                resolve(false);
            } else {
                resolve(true);
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

    const hashedPassword = hashStringToSHA256(newPassword);

    return new Promise((resolve, reject) => {

        db.run(query, [hashedPassword, user.id], (error) => {

            if (error) {
                console.log(error);
                resolve(false);
            } else {
                resolve(true);
            };

        });

    });

};

export async function deleteUser(id) {

    const query = `
        DELETE FROM pessoa
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {

        db.run(query, [id], function (error) {

            if (error) {
                resolve(false);
            } else {
                resolve(true);
            };

        });

    });

};