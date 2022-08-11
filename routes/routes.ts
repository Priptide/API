import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("CHATBOT API");
});
router.post("/post", (req, res) => {
    res.send("Post API");
});

export default router;
