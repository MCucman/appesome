const express = require("express");
const app = express();
const port = 3000;

const { connect_to_db, ObjectId } = require("./db");

(async () => {
    app.use(express.static("../client/dist/appesome/browser"));

    const db = await connect_to_db();
  

    app.get("/api/user/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        const user = await db.collection("user").findOne({_id: id });

        res.send({ user });
    });

    app.get("/api/users", async (req, res) => {
        const users = await db.collection("user").find({}).toArray();
        console.log(users)
        res.send(users);
    });

    app.get("/api/post/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        const post = await db.collection("post").findOne({_id: id });

        res.send({ post });
    });

    app.get("/api/posts", async (req, res) => {
        const posts = await db.collection("post").find({}).toArray();
        res.send(posts);
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.post("/api/user", async (req, res) => {
        const user = req.body;
        await db.collection("user").insertOne(user);
        res.send(user);
    });

    app.delete("/api/user/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        await db.collection("user").deleteOne({ _id: id });

        res.send({ message: "Successfully deleted" });
    });

    app.post("/api/post", async (req, res) => {
        const post = req.body;
        await db.collection("post").insertOne(post);
        res.send(post);
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