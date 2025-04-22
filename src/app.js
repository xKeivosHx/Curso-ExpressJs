const express = require("express");
const routerApi = require("./routes/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routerApi(app);

app.get("/", (req, res) => {
  res.send(`
    <h1>Express JS</h1>
    <p>This is an node.js app with express.js</p>
    <p>Running on PORT ${process.env.PORT || 3000}</p>
    `);
});
