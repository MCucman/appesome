const express = require("express");
const app = express();
const port = 3000;

const { connect_to_db, ObjectId } = require("./db");

(async () => {
    app.use(express.static("../client/dist/appesome/browser"));

    const db = await connect_to_db();
    const conn = db.collection("user");

    app.get("/api/user/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        const user = await conn.findOne({_id: id });

        res.send({ user });
    });

    app.get("/api/users", async (req, res) => {
        const users = await conn.find({}).toArray();
        console.log(users)
        res.send(users);
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.post("/api/user", async (req, res) => {
        const user = req.body;
        await conn.insertOne(user);
        res.send(user);
    });

    app.delete("/api/user/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        await db.collection("user").deleteOne({ _id: id });

        res.send({ message: "Successfully deleted" });
    });

    app.listen(port, () => {
        console.log(`Server is listening at ${port}`);
    });
})();