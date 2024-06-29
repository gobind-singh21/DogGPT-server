import { dbQuery } from "./databaseHandler.js";
import { PAWGPT_ID } from "./envHandler.js";

const getChatMessages = async (req, res) => {
    const user = req.user;
    try {
        const sentMessages = await dbQuery("SELECT messagetext, messagetimestamp FROM messages WHERE senderid=$1", [user.id]);
        const receivedMessages = await dbQuery("SELECT messagetext, messagetimestamp FROM messages WHERE receiverid=$1", [user.id]);
        res.status(200).json({
            sent: sentMessages.rows,
            received: receivedMessages.rows
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while getting chats" });
    }
}

const chatResponse = async (req, res) => {
    if (!req.body.messagetext || !req.body.sender) {
        console.log(req.body);
        return res.status(401).json({ message: "Requst is malformed" });
    }
    try {
        const user = req.user;
        // const response = await axios.get(
        //     `https://domain-to-be-inserted/query?ques=${req.body.content}`
        // );
        // console.log(response);
        const today = new Date().getTime();
        const serverResponse = {
            answer: `Echo ${user.id} ${req.body.sender} ${req.body.messagetext}`,
            timestamp: today
        }

        await dbQuery("INSERT INTO messages(senderid, receiverid, messagetext, messagetimestamp) VALUES($1, $2, $3, $4)",
            [user.id, PAWGPT_ID, req.body.messagetext, req.body.messagetimestamp]
        );
        await dbQuery("INSERT INTO messages(senderid, receiverid, messagetext, messagetimestamp) VALUES($1, $2, $3, $4)",
            [PAWGPT_ID, user.id, serverResponse.answer, serverResponse.timestamp]
        );

        res.json({ response: serverResponse.answer, timestamp: today });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteChatMessage = async (req, res) => {
    console.log(req.body);
    if (!req.params["messagetimestamp"] || !req.params["sender"]) {
        res.status(400).json({ message: "Request is malformed" });
    }
    try {
        console.log(req.user);
        const messageTimestamp = req.params["messagetimestamp"];
        let senderid;
        if (req.params["sender"] === "PawGPT") senderid = PAWGPT_ID;
        else senderid = req.user.id;

        console.log("Starting deletion");
        const dbResponse = await dbQuery("DELETE FROM messages WHERE senderid=$1 AND messagetimestamp=$2",
            [senderid, messageTimestamp]
        );
        console.log("Deletion ended");
        console.log(dbResponse);

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { chatResponse, getChatMessages, deleteChatMessage };