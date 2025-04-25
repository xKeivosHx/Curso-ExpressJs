const { Router } = require("express");
const appointmentsController = require("../controllers/appointments.controller");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.get(
  "/:id/appointments",
  authenticateToken,
  appointmentsController.getUserAppointments
);

module.exports = router;
