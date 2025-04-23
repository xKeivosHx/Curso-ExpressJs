const {
  createTimeBlockService,
  listReservationsService,
} = require("../services/admin.service");

const createTimeBlock = async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Access Denied" });

  const { startTime, endTime } = req.body;

  try {
    const newTimeBlock = await createTimeBlockService(startTime, endTime);
    res.status(201).json(newTimeBlock);
  } catch (error) {
    res.status(500).json({ error: "Error creating time block" });
  }
};

const listReservations = async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Access Denied" });

  try {
    const reservations = await listReservationsService();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reservations" });
  }
};

module.exports = {
  createTimeBlock,
  listReservations,
};
