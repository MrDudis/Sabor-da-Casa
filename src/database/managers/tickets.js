import db from "../db.js";

import Ticket from "../../models/Ticket.js";

export async function insert(ticket) {
    
    const query = `
        INSERT INTO comanda (id, id_cliente, id_funcionario)
        VALUES (?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {

        db.run(query, [ticket.id, ticket.userId, ticket.employeeId], function (error) {

            if (error) {
                console.log(error);
                resolve(null);
            } else {
                resolve(this.lastID);
            };

        });

    });

};

export async function insertProducts(ticket, products) {

    const query = `
        INSERT INTO comanda_produtos (id_comanda, id_produto, quantidade)
        VALUES (?, ?, ?)
        ON CONFLICT (id_comanda, id_produto) DO UPDATE SET quantidade = quantidade + ?
    `;

    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            products.forEach(product => {

                db.run(query, [ticket.id, product.id, product.quantity, product.quantity], function (error) {

                    if (error) {
                        console.log(error);
                        resolve(false);
                    };

                });

            });

            const updatedAtQuery = `
                UPDATE comanda
                SET data_edicao = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            db.run(updatedAtQuery, [ticket.id], function (error) {

                if (error) {
                    console.log(error);
                    resolve(false);
                };

            });

            db.run("COMMIT", function (error) {

                if (error) {
                    console.log(error);
                    resolve(false);
                } else {
                    resolve(true);

                };

            });

        });

    });

};

export async function get(id) {

    const query = `
        SELECT *
        FROM comanda
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {

        db.get(query, [id], (error, row) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (row) {

                const ticket = new Ticket(row);

                const query = `
                    SELECT *
                    FROM comanda_produtos
                    WHERE id_comanda = ?
                `;

                db.all(query, [id], (error, rows) => {

                    if (error) {
                        console.log(error);
                        resolve(null);
                    } else if (rows) {

                        ticket.products = rows.map(row => {

                            return {
                                id: row.id_produto,
                                quantity: row.quantidade
                            };

                        });

                        resolve(ticket);

                    } else {
                        resolve(null);
                    };

                });

            } else {
                resolve(null);
            };

        });

    });

};

export async function getByUserId(userId) {

    const query = `
        SELECT *
        FROM comanda
        WHERE id_cliente = ?
        ORDER BY data_criacao DESC
    `;

    return new Promise((resolve, reject) => {

        db.all(query, [userId], (error, rows) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (rows) {
                
                const tickets = rows.map(row => new Ticket(row));

                const query = `
                    SELECT *
                    FROM comanda_produtos
                    WHERE id_comanda = ?
                `;

                db.serialize(() => {

                    tickets.forEach(ticket => {

                        db.all(query, [ticket.id], (error, rows) => {

                            if (error) {
                                console.log(error);
                                resolve(null);
                            } else if (rows) {

                                ticket.products = rows.map(row => {

                                    return {
                                        id: row.id_produto,
                                        quantity: row.quantidade
                                    };

                                });

                            };

                        });

                    });

                });

                resolve(tickets);


            } else {
                resolve(null);
            };

        });

    });


};

export async function getAll() {

    const query = `
        SELECT *
        FROM comanda
    `;

    return new Promise((resolve, reject) => {

        db.all(query, [], (error, rows) => {

            if (error) {
                console.log(error);
                resolve([]);
            } else if (rows) {
                
                const tickets = rows.map(row => new Ticket(row));

                const query = `
                    SELECT *
                    FROM comanda_produtos
                    WHERE id_comanda = ?
                `;

                db.serialize(() => {

                    tickets.forEach(ticket => {

                        db.all(query, [ticket.id], (error, rows) => {

                            if (error) {
                                console.log(error);
                                resolve(null);
                            } else if (rows) {

                                ticket.products = rows.map(row => {

                                    return {
                                        id: row.id_produto,
                                        quantity: row.quantidade
                                    };

                                });

                            };

                        });

                    });

                });

                resolve(tickets);

            } else {
                resolve([]);
            };

        });

    });

};

export async function updateProduct(id, productId, quantity) {

    const upsertQuery = `
        INSERT INTO comanda_produtos (id_comanda, id_produto, quantidade)
        VALUES (?, ?, ?)
        ON CONFLICT (id_comanda, id_produto) DO UPDATE SET quantidade = ?
    `;

    const deleteQuery = `
        DELETE FROM comanda_produtos
        WHERE id_comanda = ? AND id_produto = ?
    `;

    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            if (quantity > 0) {

                db.run(upsertQuery, [id, productId, quantity, quantity], function (error) {

                    if (error) {
                        console.log(error);
                        resolve(false);
                    };

                });

            } else {

                db.run(deleteQuery, [id, productId], function (error) {

                    if (error) {
                        console.log(error);
                        resolve(false);
                    };

                });

            };

            const updatedAtQuery = `
                UPDATE comanda
                SET data_edicao = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            db.run(updatedAtQuery, [id], function (error) {

                if (error) {
                    console.log(error);
                    resolve(false);
                };

            });

            db.run("COMMIT", function (error) {

                if (error) {
                    console.log(error);
                    resolve(false);
                } else {
                    resolve(true);

                };

            });

        });

    });

};

export async function deleteTicket(id) {

    const query = `
        UPDATE comanda
        SET ativa = 0, data_edicao = CURRENT_TIMESTAMP
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