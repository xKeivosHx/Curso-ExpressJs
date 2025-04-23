const { Router } = require("express");
const { register, login } = require("../controllers/auth.controller");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/protected-route", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

module.exports = router;
