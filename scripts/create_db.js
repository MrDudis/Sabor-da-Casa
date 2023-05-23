const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

if (!fs.existsSync("./database")) {
    fs.mkdirSync("./database");
};

const db = new sqlite3.Database("./database/database.db");

function create_db() {

    console.log("> Creating database...");

    fs.writeFileSync("./database/database.db", "");

    db.serialize(() => {

        db.run(`
            CREATE TABLE pessoa (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cpf CHAR(11) NOT NULL,
                nome VARCHAR(128) NOT NULL,
                data_nasc DATE NOT NULL,
                sexo INTEGER NOT NULL,
                telefone VARCHAR(25),
                email VARCHAR(64),
                senha VARCHAR(64) NOT NULL
            );

            CREATE TABLE cliente (
                id_pessoa CHAR(11) PRIMARY KEY NOT NULL,
                data_reg DATETIME NOT NULL,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
            
            CREATE TABLE funcionario (
                id_pessoa CHAR(11) PRIMARY KEY NOT NULL,
                data_vinc DATETIME NOT NULL,
                salario DOUBLE NOT NULL,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
            
            CREATE TABLE gerente (
                id_pessoa CHAR(11) PRIMARY KEY NOT NULL,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );

            CREATE TABLE administrador (
                id_pessoa CHAR(11) PRIMARY KEY NOT NULL,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );

            CREATE TABLE produto (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome VARCHAR(50) NOT NULL,
                preco DOUBLE NOT NULL,
                estoque INTEGER NOT NULL
            );
        `);

        db.run(`
            CREATE TABLE tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token VARCHAR(64) NOT NULL,
                id_pessoa CHAR(11) NOT NULL,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
        `);

        db.run(`
            INSERT INTO pessoa (cpf, nome, data_nasc, sexo, telefone, email, senha) VALUES 
            ("00000000000", "Administrador", "2000-01-01", 0, "00000000000", "admin", "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918");

            INSERT INTO administrador (id_pessoa) VALUES ("1");
        `);
    
    });

    console.log("> Database created.\n");

};

create_db();