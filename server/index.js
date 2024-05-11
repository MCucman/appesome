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
        const _username = req.params.username;
        const user = await db.collection("user").findOne({ username: _username });
        res.send(user);
    });

    app.get("/api/users", async (req, res) => {
        const users = await db.collection("user").find().toArray();
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

    app.post("/api/users", async (req, res) => {
        const query = req.body.query;
        const users = await db.collection("user").find(query).toArray();
        res.send(users);
    })

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

    app.patch("/api/user", async (req, res) => {
        const username = req.body.username;
        await db.collection("user").updateOne({ username: username }, { $set: { isLoggedIn: true } });
        const user = await db.collection("user").findOne({ username: username });
        res.send(user);
    });

    app.delete("/api/user/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        await db.collection("user").deleteOne({ _id: id });

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

    app.patch("/api/post/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        await db.collection("post").updateOne({ _id: id }, { $inc: { likes: 1 } });
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