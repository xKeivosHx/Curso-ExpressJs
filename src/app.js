const express = require("express");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const LoggerMiddleware = require("./middlewares/logger");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(errorHandler);

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send(`
    <h1>Express JS</h1>
    <p>This is an node.js app with express.js</p>
    <p>Running on PORT ${process.env.PORT || 3000}</p>
    `);
});

module.exports = app;
