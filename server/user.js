const express = require("express");
const { connect_to_db } = require("./db");

const router = express.Router();
let db;

(async () => {
    db = await connect_to_db();
})();

router.get("/:username", async (req, res) => {
    const username = req.params.username;
    const user = await db.collection("user").findOne({ username: username });
    res.send(user);
});

router.get("/followers/:username", async (req, res) => {
    const username = req.params.username;
    const users = await db.collection("user").find({ following: username }).toArray();
    res.send(users);
});

router.get("/exists/:username", async (req, res) => {
    const username = req.params.username;
    try {
        const existingUser = await db.collection('user').findOne({ username: username });

        if (existingUser) {
            return res.json(true);
        } else {
            return res.json(false);
        }
    } catch (error) {
        console.error('Error checking username existence:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/", async (req, res) => {
    const user = req.body;
    try {
        const userExists = await db.collection("user").findOne({ username: user.username });
        if (userExists) {
            throw new Error('Username exists');
        }
        await db.collection("user").insertOne(user);
        res.send(user);
    } catch (error) {
        res.send({ message: error.message })
    }
});

router.patch("/follows/:currUsername/:othUsername", async (req, res) => {
    const currUsername = req.params.currUsername;
    const othUsername = req.params.othUsername;
    const user = await db.collection("user").findOne({ username: currUsername });
    if (!user.following.includes(othUsername)) {
        const user2 = await db.collection("user").findOneAndUpdate(
            { username: currUsername },
            { $push: { following: othUsername } },
            { returnDocument: 'after' }
        );
        res.send(user2);
    } else {
        const user2 = await db.collection("user").findOneAndUpdate(
            { username: currUsername },
            { $pull: { following: othUsername } },
            { returnDocument: 'after' }
        );
        res.send(user2);
    }
});

router.patch("/:username", async (req, res) => {
    const username = req.params.username;
    const newData = req.body;
    if (newData['username']) {
        await db.collection("post").updateMany(
            { likes: username },
            { $set: { "likes.$[i]": newData.username } },
            { arrayFilters: [{ 'i': username }] }
        );
        await db.collection("post").updateMany(
            { author: username },
            { $set: { author: newData.username } }
        );
        await db.collection("user").updateMany(
            { following: username },
            { $set: { "following.$[i]": newData.username } },
            { arrayFilters: [{ 'i': username }] }
        );
    }
    const user = await db.collection("user").findOneAndUpdate({ username }, { $set: newData }, { returnDocument: 'after' });
    res.send(user);
});

router.delete("/:username", async (req, res) => {
    const username = req.params.username;
    await db.collection("user").deleteOne({ username: username });
    await db.collection("post").deleteMany({ author: username });
    await db.collection("post").updateMany({ likes: username }, { $pull: { likes: username } });
    await db.collection("user").updateMany({ following: username }, { $pull: { following: username } });
    res.send({ message: "Successfully deleted" });
});

module.exports = router;
