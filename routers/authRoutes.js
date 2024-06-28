import express from "express";
import { authLogin, authSignUp, chechAuth, logout } from "../handlers/authHandlers.js";

const router = express.Router();

router.post("/login", authLogin);
router.post("/sign-up", authSignUp);
router.get("/check-auth", chechAuth);
router.get("/logout", logout);

export default router;