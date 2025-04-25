const { Router } = require("express");
const authRouter = require("./auth.router");
const adminRouter = require("./admin.router");
const reservationsRouter = require("./reservations.router");

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/reservations", reservationsRouter);

module.exports = router;
