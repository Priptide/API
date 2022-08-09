import express from "express";
const router = express.Router();

router.get("/post", (req, res) => {
    res.send("GET API");
});
router.post("/post", (req, res) => {
    res.send("Post API");
});

export default router;
