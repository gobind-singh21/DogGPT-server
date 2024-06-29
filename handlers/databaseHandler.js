import pg from "pg";
import { DB_CONFIG } from "./envHandler.js";
import fs from "fs";

const db = new pg.Client({
    connectionString: DB_CONFIG.DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(DB_CONFIG.SSL_CA).toString(),
    }
});

db.connect();

const dbQuery = async (query, values) => {
    try {
        const dbResponse = await db.query(query, values);
        return dbResponse;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export { dbQuery };