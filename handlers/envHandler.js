import dotenv from "dotenv";

dotenv.config();

const SERVER_PORT = process.env.PORT_NUMBER;
const DB_CONFIG = {
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PASSWORD: process.env.DB_PASSWORD
};
const SALT_ROUNDS = process.env.SALT_ROUNDS;
const JWT_SECRET = process.env.JWT_SECRET;

export { SERVER_PORT, DB_CONFIG, SALT_ROUNDS, JWT_SECRET };