require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <h1>Express JS</h1>
    <p>This is an node.js app with express.js</p>
    <p>Running on PORT ${PORT}</p>
    `);
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  console.log(userId);

  res.send(`The user id is ${userId}`);
});

app.get("/search", (req, res) => {
  const terms = req.query.term || "Not Specified";
  const category = req.query.category || "Todas";

  res.send(`
        <h2>Resultados de la Búsqueda</h2>
        <p>Término: ${terms}</p>
        <p>Categoría: ${category}</p>
    `);
});

app.post("/form", (req, res) => {
  const name = req.body.name || "Anonymous";
  const email = req.body.email || "Not provided";

  res.status(200).json({
    message: "JSON Data",
    data: {
      name,
      email,
    },
  });
});

app.post("/data", (req, res) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      error: "No data provided",
    });
  }

  res.status(200).json({
    message: "JSON Data received",
    data,
  });
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`);
});
