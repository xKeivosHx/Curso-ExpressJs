require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <h1>Express JS</h1>
    <p>This is an node.js app with express.js</p>
    <p>Running on PORT ${PORT}</p>
    `);
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`);
});
