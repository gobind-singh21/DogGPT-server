import express from "express";
import { getProfileEmail, updateProfile } from "../handlers/profileHandlers.js";

const router = express.Router();

router.get("/get-email", getProfileEmail);
router.patch("/update-profile", updateProfile);

export default router;