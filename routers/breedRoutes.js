import express from "express";
import axios from "axios";
import multer from "multer";

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../uploads/breed_classify");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const imageUpload = multer({ imageStorage });

const router = express.Router();

router.post("/", imageUpload.single("file"), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "Image file not included" });
    }
    try {
        const formData = new FormData();
        formData.append("file", req.file);
        const response = await axios.post("url-to-be-inserted", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        res.status(200).json({ message: "File uploaded successfully", filename: req.file.filename });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;