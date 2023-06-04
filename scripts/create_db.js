import sqlite3 from "sqlite3";
import fs from "fs";

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
                nome VARCHAR(255) NOT NULL,
                data_nasc DATE NOT NULL,
                sexo INTEGER NOT NULL,
                telefone VARCHAR(11),
                email VARCHAR(255),
                senha VARCHAR(64) NOT NULL
            );
        `);

        db.run(`
            CREATE TABLE cliente (
                id_pessoa INTEGER PRIMARY KEY,
                data_reg DATETIME,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
        `);

        db.run(`
            CREATE TABLE funcionario (
                id_pessoa INTEGER PRIMARY KEY,
                data_vinc DATETIME,
                salario DOUBLE,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
        `);

        db.run(`
            CREATE TABLE caixa (
                id_pessoa INTEGER PRIMARY KEY,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
        `);

        db.run(`
            CREATE TABLE gerente (
                id_pessoa INTEGER PRIMARY KEY,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
        `);

        db.run(`
            CREATE TABLE administrador (
                id_pessoa INTEGER PRIMARY KEY,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
        `);

        db.run(`
            CREATE TABLE tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token VARCHAR(64) NOT NULL,
                id_pessoa INTEGER NOT NULL,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
        `);

        db.run(`
            CREATE TABLE produto (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome VARCHAR(255) NOT NULL,
                descricao TEXT NOT NULL,
                imagem VARCHAR(128),
                preco DOUBLE NOT NULL,
                estoque INTEGER NOT NULL
            );
        `);

        db.run(`
            CREATE TABLE dispositivo (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_pessoa INTEGER,
                FOREIGN KEY (id_pessoa) REFERENCES pessoa(id)
            );
        `);

        db.run(`
            INSERT INTO pessoa (cpf, nome, data_nasc, sexo, telefone, email, senha) VALUES 
            ("00000000000", "Administrador", "2000-01-01", 0, "00000000000", "admin", "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918");
        `);

        db.run(`
            INSERT INTO administrador (id_pessoa) VALUES (1);
        `);

        db.run(`
            INSERT INTO produto (nome, descricao, imagem, preco, estoque) VALUES
            ("Hambúrguer Clássico", "Delicioso hambúrguer com carne suculenta, queijo derretido, alface fresca e molho especial.", "/images/products/hamburguer-classico.jpg", 12.50, 15),
            ("Pizza Margherita", "Pizza clássica italiana com molho de tomate, queijo mussarela, manjericão e azeite de oliva.", "/images/products/pizza-margherita.jpg", 16.75, 10),
            ("Sopa de Legumes", "Sopa caseira com uma mistura saudável de legumes frescos e temperos.", "/images/products/sopa-de-legumes.jpg", 8.90, 20),
            ("Salada Caesar", "Salada refrescante com alface crocante, croutons, queijo parmesão ralado e molho Caesar.", "/images/products/salada-caesar.jpg", 9.50, 12),
            ("Frango Grelhado", "Peito de frango grelhado suculento servido com legumes frescos e arroz.", "/images/products/frango-grelhado.jpg", 14.25, 18),
            ("Espaguete à Bolonhesa", "Massa de espaguete cozida ao dente com molho de carne rico e temperos italianos.", "/images/products/espaguete-a-bolonhesa.jpg", 11.90, 14),
            ("Taco de Camarão", "Taco crocante recheado com camarão temperado, alface picada, tomate e molho especial.", "/images/products/taco-de-camarao.jpg", 10.75, 8),
            ("Risoto de Cogumelos", "Risoto cremoso preparado com cogumelos frescos, arroz arbóreo e queijo parmesão.", "/images/products/risoto-de-cogumelos.jpg", 15.50, 9),
            ("Sanduíche de Frango Grelhado", "Sanduíche com peito de frango grelhado, alface, tomate e maionese, servido em pão integral.", "/images/products/sanduiche-de-frango-grelhado.jpg", 8.25, 16),
            ("Salada de Frutas", "Uma mistura fresca de frutas da estação, perfeita para um lanche saudável.", "/images/products/salada-de-frutas.jpg", 6.50, 22),
            ("Wrap Vegetariano", "Wrap recheado com legumes frescos, queijo feta e molho de iogurte.", "/images/products/wrap-vegetariano.jpg", 9.75, 11),
            ("Salmão Grelhado", "Filé de salmão grelhado no ponto certo, acompanhado de purê de batatas e legumes.", "/images/products/salmao-grelhado.jpg", 17.50, 7),
            ("Panqueca de Banana", "Deliciosa panqueca feita com massa leve e recheada com rodelas de banana e xarope de bordo.", "/images/products/panqueca-de-banana.jpg", 7.90, 19),
            ("Bruschetta Caprese", "Fatias de pão italiano tostado coberto com tomate, mussarela fresca, manjericão e azeite.", "/images/products/bruschetta-caprese.jpg", 6.75, 13),
            ("Torta de Maçã", "Torta caseira de maçã com uma crosta de massa amanteigada e recheio de maçãs frescas.", "/images/products/torta-de-maca.jpg", 10.50, 17),
            ("Churrasco Misto", "Combinação suculenta de carnes grelhadas, incluindo picanha, linguiça e frango.", "/images/products/churrasco-misto.jpg", 18.90, 6),
            ("Omelete de Queijo", "Omelete fofinho preparado com ovos, queijo derretido e temperos a gosto.", "/images/products/omelete-de-queijo.jpg", 8.50, 21),
            ("Camarão ao Alho e Óleo", "Camarões suculentos refogados no alho, azeite e ervas, acompanhados de arroz branco.", "/images/products/camarao-ao-alho-e-oleo.jpg", 16.25, 10),
            ("Mousse de Chocolate", "Sobremesa clássica de mousse de chocolate cremoso, perfeita para os amantes de chocolate.", "/images/products/mousse-de-chocolate.jpg", 6.90, 15),
            ("Café Expresso", "Café curto e forte, preparado com grãos de alta qualidade e servido em xícara pequena.", "/images/products/cafe-expresso.jpg", 2.50, 25);
        `);
    
    });

    console.log("> Database created.\n");

};

create_db();