import db from "../db.js";

function generate_token() {

    let token = "";

    for (let i = 0; i < 64; i++) {
        token += Math.floor(Math.random() * 16).toString(16);
    }

    return token;

};

export async function create(id_pessoa) {

    const query = `
        INSERT INTO 
        tokens (token, id_pessoa) 
        VALUES (?, ?)
    `;

    let token = generate_token();
    
    return new Promise((resolve, reject) => {

        db.run(query, [token, id_pessoa], (error) => {
            if (error) {
                resolve(null);
            } else {
                resolve(token);
            }
        });

    });

};