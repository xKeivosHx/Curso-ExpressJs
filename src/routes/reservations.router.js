const { Router } = require("express");
const reservationsController = require("../controllers/reservations.controller");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.post("/", authenticateToken, reservationsController.createReservation);

router.get("/:id", authenticateToken, reservationsController.getReservation);

router.put("/:id", authenticateToken, reservationsController.updateReservation);

router.delete(
  "/:id",
  authenticateToken,
  reservationsController.deleteReservation
);

module.exports = router;
