import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import { verifyToken } from "./handlers/tokenHandlers.js";
import { SERVER_PORT } from "./handlers/envHandler.js";

import authRouter from "./routers/authRoutes.js";
import profileRouter from "./routers/profileRoutes.js"
import chatRouter from "./routers/chatRoutes.js"
import breedRouter from "./routers/breedRoutes.js";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(verifyToken);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/chat", chatRouter);
app.use("/breed-check", breedRouter);

app.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}/`);
});
