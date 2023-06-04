import db from "../db.js";

import Device from "../../models/Device.js";

export async function insert(device) {
    console.log(device)
    const query = `
        INSERT INTO dispositivo (id_pessoa)
        VALUES (?)
    `;
    
    return new Promise((resolve, reject) => {

        db.run(query, [device.userId], function (error) {

            if (error) {
                console.log(error);
                resolve(null);
            } else {
                resolve(this.lastID);
            };

        });

    });

};

export async function getAll() {

    const query = `
        SELECT *
        FROM dispositivo
    `;

    return new Promise((resolve, reject) => {

        db.all(query, (error, rows) => {

            if (error) {
                console.log(error);
                resolve(null);
            } else if (rows) {
                resolve(rows.map(row => new Device(row)));
            } else {
                resolve(null);
            };

        });

    });

};

export async function deleteDevice(id) {

    const query = `
        DELETE FROM dispositivo
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

export async function deleteAll() {
    
    const query = `
        DELETE FROM dispositivo
    `;

    return new Promise((resolve, reject) => {

        db.run(query, function (error) {

            if (error) {
                console.log(error);
                resolve(false);
            } else {
                resolve(true);
            };

        });

    });

};