const reservationService = require("../services/reservations.service");

exports.createReservation = async (req, res) => {
  try {
    const newReservation = await reservationService.createReservation(req.body);

    res.status(201).json(newReservation);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error creating reservation:" + error.message });
  }
};

exports.getReservation = async (req, res) => {
  try {
    const reservation = await reservationService.getReservation(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error fetching reservation:" + error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const updatedReservation = await reservationService.updateReservation(
      req.body
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error updating reservation: " + error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await reservationService.deleteReservation(
      req.params.id
    );

    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error deleting reservation: " + error.message });
  }
};
