const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connect_to_db } = require("./db");

const router = express.Router();
let db;
const JWT_SECRET = "your_secret_key"; 

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
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await db.collection("user").insertOne(user);
        res.send(user);
    } catch (error) {
        res.send({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.collection("user").findOne({ username });
        if (!user) {
            throw new Error("Invalid username or password");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
});

router.post("/verifyPassword", async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await db.collection("user").findOne({ username });
      if (!user) {
          return res.json(false);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid)
      res.json(isPasswordValid);
  } catch (error) {
      console.error('Error verifying password:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch("/:username", async (req, res) => {
  const username = req.params.username;
  const newData = req.body;
  if (newData.password) {
      newData.password = await bcrypt.hash(newData.password, 10);
  }
  if (newData.username) {
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
  let user;
  if(!newData._id){
    user = await db.collection("user").findOneAndUpdate(
      { username: username }, 
      { $set: newData }, 
      { returnDocument: 'after' }
  );
  }
  
  res.send(user);
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



router.delete("/:username", async (req, res) => {
    const username = req.params.username;
    await db.collection("user").deleteOne({ username: username });
    await db.collection("post").deleteMany({ author: username });
    await db.collection("post").updateMany({ likes: username }, { $pull: { likes: username } });
    await db.collection("user").updateMany({ following: username }, { $pull: { following: username } });
    res.send({ message: "Successfully deleted" });
});

module.exports = router;
