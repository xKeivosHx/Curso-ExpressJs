require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const LoggerMiddleware = require("./src/middlewares/logger");
const errorHandler = require("./src/middlewares/errorHandler");
const { validateUser, validateUserUpdate } = require("./src/utils/validations");
const authenticateToken = require("./src/middlewares/auth");

const fs = require("fs");
const path = require("path");
const usersFilePath = path.join(__dirname, "users.json");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <h1>Express JS</h1>
    <p>This is an node.js app with express.js</p>
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

app.get("/users", (req, res) => {
  fs.readFile(usersFilePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({
        error: "Error data connection",
      });
    }

    const users = JSON.parse(data);
    res.json(users);
  });
});

app.post("/users", (req, res) => {
  const newUser = req.body;

  fs.readFile(usersFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({
        error: "The connection data failed.",
      });
    }

    let users = JSON.parse(data);

    const validate = validateUser(newUser, users);
    if (!validate.isValid) {
      return res.status(400).json({
        error: validate.errors,
      });
    }

    users.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(400).json({
          error: "Error saving user",
        });
      }

      res.status(201).json(newUser);
    });
  });
});

app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updateUser = req.body;

  fs.readFile(usersFilePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Error data connection" });
    }

    let users = JSON.parse(data);

    const validate = validateUserUpdate(userId, updateUser, users);
    if (!validate.isValid) {
      return res.status(400).json({
        error: validate.errors,
      });
    }

    users = users.map((user) => {
      return user.id === userId ? { ...user, ...updateUser } : user;
    });

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al actualizar el usuario" });
      }

      res.json(updateUser);
    });
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error data connection." });
    }

    let users = JSON.parse(data);
    users = users.filter((user) => user.id !== userId);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error deleting user." });
      }

      res.status(204).send();
    });
  });
});

app.get("/db/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error DB connection." });
  }
});

app.post("/db/create", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });

    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(new Error(error));
  }
});

app.get("/db/delete/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const userExists = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    console.log(user);
    res.status(200).json({
      message: "User deleted.",
    });
  } catch (error) {
    next(new Error(error));
  }
});

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "USER",
    },
  });

  return res.status(201).json({
    message: "User created successfully",
    user,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({
    message: "Login successful",
    token,
  });
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`);
});
