const express = require("express");
const dotenv = require("dotenv");
const blogRoute = require("./src/blog/routes");
const sequelize = require("./db");
const model = require("./model");
const app = express();
dotenv.config();

//allows us to post and get json from endpoints
app.use(express.json());
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/", blogRoute);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
