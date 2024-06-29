import bcrypt from "bcrypt";
import { generateToken } from "./tokenHandlers.js";
import { dbQuery } from "./databaseHandler.js";
import { SALT_ROUNDS } from "./envHandler.js";

const authLogin = async (req, res) => {
    if (!req.body.userEmail || !req.body.userPassword) {
        return res.status(400).json({ message: "Malformed request" });
    }
    // console.log("request received", req.body);
    const { userEmail, userPassword } = req.body;
    try {
        // console.log("Accessing database");
        const dbResponse = await dbQuery("SELECT * FROM users WHERE email=$1",
            [userEmail]
        );
        // console.log("Database output", dbResponse.rows);
        if (dbResponse.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = dbResponse.rows[0];

        // console.log("starting hashing");
        bcrypt.compare(userPassword, user.password, (err, isMatching) => {
            if (err) {
                // console.log("hashing error", err);
                return res.status(500).json({ message: "Internal server error" });
            }

            if (!isMatching) {
                console.log("Password didn't matched");
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // console.log("Generating token");

            const token = generateToken(user.id, user.email);
            if (token === "Error") {
                return res.status(500).json({ message: "Internal server error" });
            }
            res.cookie("authToken", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 3600000
            });
            // console.log("Generated token", token);
            res.status(200).json({ userName: user.name, });
        });
    } catch (error) {
        console.log("some error", error);
        res.status(500).json({ message: "Internal server error" })
    }
};

const authSignUp = (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
    console.log("request recieved", req.body);
    if (!(userName && userEmail && userPassword)) {
        res.status(400).json({ message: "Request is malformed" });
        return;
    }

    try {
        console.log("started hashing");
        bcrypt.hash(userPassword, parseInt(SALT_ROUNDS), async (err, hashedPassword) => {
            if (err) {
                console.log("hashing error", err);
                res.status(500).json({ message: "Internal server error" });
            } else {
                console.log("hashing successful", hashedPassword);
                const dbResponse = await dbQuery("INSERT INTO users(email, password, name) VALUES($1, $2, $3) RETURNING id, email, name",
                    [userEmail, hashedPassword, userName]
                );

                if (!dbResponse) {
                    res.status(500).json({ message: "Internal server error" });
                    return;
                }

                console.log("database insertion successful\nGenerating token");
                const user = dbResponse.rows[0];
                const token = generateToken(user.id, user.email);

                console.log("Token generated", token);
                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 24 * 3600000
                });
                res.status(200).json({ userName: user.name });
            }
        });
    } catch (error) {
        console.log("some other error occured");
        res.status(500).json({ message: "Internal server error" });
    }
};

const chechAuth = (req, res) => {
    res.status(200).json({ authenticated: true });
}

const logout = (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    res.status(200).json({ message: "Logged out successfully" });
};

export { authLogin, authSignUp, chechAuth, logout };