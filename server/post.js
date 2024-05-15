const express = require("express");
const { connect_to_db, ObjectId } = require("./db");

const router = express.Router();
let db;

(async () => {
    db = await connect_to_db();
})();

router.get("/", async (req, res) => {
    const posts = await db.collection("post").find({}).toArray();
    res.send(posts);
});

router.get("/:id", async (req, res) => {
    const id = new ObjectId(req.params.id);
    const post = await db.collection("post").findOne({ _id: id });
    res.send({ post });
});

router.post("/", async (req, res) => {
    const post = req.body;
    await db.collection("post").insertOne(post);
    res.send(post);
});

router.patch("/:post_id/:username", async (req, res) => {
    const post_id = new ObjectId(req.params.post_id);
    const username = req.params.username;
    const post = await db.collection("post").findOne({ _id: post_id });
    const likes = post.likes;
    const updatedLikes = likes.includes(username) ? likes.filter(like => like !== username) : [...likes, username];
    await db.collection("post").updateOne({ _id: post_id }, { $set: { likes: updatedLikes } });
    res.send({ message: "Successfully updated" });
});

router.delete("/:id", async (req, res) => {
    const id = new ObjectId(req.params.id);
    await db.collection("post").deleteOne({ _id: id });
    res.send({ message: "Successfully deleted" });
});

module.exports = router;
