const appointmentsService = require("../services/appointments.service");

exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.id;
    const appointments = await appointmentsService.getUserAppointments(userId);

    if (appointments.length === 0) {
      return res.status(404).json({ error: "No appointments found" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching appointments: " + error.message });
  }
};
