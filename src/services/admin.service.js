const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTimeBlockService = async (startTime, endTime) => {
  try {
    const newTimeBlock = await prisma.timeBlock.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return newTimeBlock;
  } catch (error) {
    throw new Error("Error creating time block");
  }
};

const listReservationsService = async () => {
  try {
    const reservations = await prisma.appointment.findMany({
      include: {
        timeBlock: true,
        user: true,
      },
    });

    return reservations;
  } catch (error) {
    throw new Error("Error fetching reservations");
  }
};

module.exports = {
  createTimeBlockService,
  listReservationsService,
};
