const express = require("express");
const app = express();
const port = 3000;

const { connect_to_db, ObjectId } = require("./db");

(async () => {
    app.use(express.static("../client/dist/appesome/browser"));

    const db = await connect_to_db();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.get("/api/user/:username", async (req, res) => {
        const username = req.params.username;
        const user = await db.collection("user").findOne({ username: username });
        res.send(user);
    });

    app.get("/api/users/:username", async (req, res) => {
        username = req.params.username;
        const users = await db.collection("user").find({following: username}).toArray();
        res.send(users);
    });

    app.get("/api/user/exists/:username", async (req, res) => {
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

    app.post("/api/user", async (req, res) => {
        const user = req.body;
        try {
            const userExists = await db.collection("user").findOne({username: user.username});
            if(userExists){
                throw new Error('Username exists');
            }
            await db.collection("user").insertOne(user);
            res.send(user);
        } catch (error) {
            res.send({message: error.message})
        }
    });

    app.patch("/api/user/follows/:currUsername/:othUsername", async (req, res) => {
        currUsername = req.params.currUsername;
        othUsername = req.params.othUsername;
        const user = await db.collection("user").findOneAndUpdate({ username: currUsername }, { $push: { following: othUsername } }, { returnDocument: 'after' });
        res.send(user);
    });

    app.patch("/api/user/:username", async (req, res) => {
        const username = req.params.username;
        const newData = req.body;
        if(newData['username']){
            await db.collection("post").updateMany(
                { likes: username }, 
                { $set: { "likes.$[i]": newData.username } },
                {arrayFilters:[{'i':username}]}
            );
            await db.collection("post").updateMany(
                {author: username},
                {$set: {author: newData.username}}
            );
        }
        const user = await db.collection("user").findOneAndUpdate({ username }, { $set: newData }, { returnDocument: 'after' });
        res.send(user);
    })

    app.delete("/api/user/:username", async (req, res) => {
        const username = req.params.username;
        await db.collection("user").deleteOne({ username: username });

        res.send({ message: "Successfully deleted" });
    });

    app.get("/api/posts", async (req, res) => {
        const posts = await db.collection("post").find({}).toArray();
        res.send(posts);
    });

    app.get("/api/post/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        const post = await db.collection("post").findOne({_id: id });

        res.send({ post });
    });

    app.post("/api/post", async (req, res) => {
        const post = req.body;
        await db.collection("post").insertOne(post);
        res.send(post);
    });

    app.patch("/api/post/:post_id/:username", async (req, res) => {
        const post_id = new ObjectId(req.params.post_id);
        const username = req.params.username;
        const post = await db.collection("post").findOne({ _id: post_id });
        const likes = post.likes;
        const updatedLikes = likes.includes(username) ? likes.filter(like => like !== username) : [...likes, username];
        await db.collection("post").updateOne({ _id: post_id }, {$set: { likes: updatedLikes } });
        res.send({ message: "Successfully updated" });
    });

    app.delete("/api/post/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        await db.collection("post").deleteOne({ _id: id });

        res.send({ message: "Successfully deleted" });
    });

    app.listen(port, () => {
        console.log(`Server is listening at ${port}`);
    });
})();