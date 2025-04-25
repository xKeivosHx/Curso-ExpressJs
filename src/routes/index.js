const { Router } = require("express");
const authRouter = require("./auth.router");
const adminRouter = require("./admin.router");
const reservationsRouter = require("./reservations.router");
const appointmentsRouter = require("./appointments.router");

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/users", appointmentsRouter);
router.use("/reservations", reservationsRouter);

module.exports = router;
