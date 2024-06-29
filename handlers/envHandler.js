import dotenv from "dotenv";

dotenv.config();

const SERVER_PORT = process.env.PORT_NUMBER;
const DB_CONFIG = {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    SSL_CA: process.env.SSL_CA
};
const PAWGPT_ID = process.env.PAWGPT_ID;
const SALT_ROUNDS = process.env.SALT_ROUNDS;
const JWT_SECRET = process.env.JWT_SECRET;

export { SERVER_PORT, DB_CONFIG, PAWGPT_ID, SALT_ROUNDS, JWT_SECRET };