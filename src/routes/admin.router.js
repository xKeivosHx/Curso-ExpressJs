const { Router } = require("express");
const {
  createTimeBlock,
  listReservations,
} = require("../controllers/admin.controller");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.post("/time-blocks", authenticateToken, createTimeBlock);

router.post("/reservations", authenticateToken, listReservations);

module.exports = router;
