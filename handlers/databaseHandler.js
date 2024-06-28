import pg from "pg";
import { DB_CONFIG } from "./envHandler.js";

const db = new pg.Client({
    host: DB_CONFIG.DB_HOST,
    user: DB_CONFIG.DB_USER,
    database: DB_CONFIG.DB_DATABASE,
    port: DB_CONFIG.DB_PORT,
    password: DB_CONFIG.DB_PASSWORD
});

db.connect();

const dbQuery = async (query, values) => {
    const dbResponse = await db.query(query, values);
    return dbResponse;
};

export { dbQuery };