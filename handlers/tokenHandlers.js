import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./envHandler.js";
import { dbQuery } from "./databaseHandler.js";

const generateToken = (id, email) => {
    try {
        const token = jwt.sign({ id, email }, JWT_SECRET, {
            expiresIn: "1d"
        });
        return token;
    }
    catch (error) {
        console.log("Error occured generating token", error);
        return "Error";
    }
}

const verifyToken = async (req, res, next) => {
    if (req.path === "/auth/login" || req.path === "/auth/sign-up") {
        next();
        return;
    }
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(400).json({ message: "Malformed request" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        const dbResponse = await dbQuery("SELECT id, email FROM users WHERE id=$1 AND email=$2", [decoded.id, decoded.email]);
        if (dbResponse.rows.length === 0) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { generateToken, verifyToken };