const express = require("express");
const app = express();
const port = 3000;

const userRoutes = require("./user");
const postRoutes = require("./post");

(async () => {
    app.use(express.static("../client/dist/appesome/browser"));

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use("/api/user", userRoutes);
    app.use("/api/post", postRoutes);

    app.listen(port, () => {
        console.log(`Server is listening at ${port}`);
    });
})();
