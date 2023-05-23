import sqlite3 from "sqlite3";
import fs from "fs";

if (!fs.existsSync("./database")) {
    fs.mkdirSync("./database");
};

const db = new sqlite3.Database("./database/database.db");

export default db;