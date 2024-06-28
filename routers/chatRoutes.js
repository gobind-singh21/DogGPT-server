import express from "express";
import { chatResponse, deleteChatMessage, getChatMessages } from "../handlers/chatHandlers.js";

const router = express.Router();

router.get("/get-messages", getChatMessages);
router.post("/message", chatResponse);
router.delete("/delete-message/:messagetimestamp/:sender", deleteChatMessage);

export default router;