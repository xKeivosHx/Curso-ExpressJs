const { PrismaClient } = require("../../prisma/app/generated/prisma/client");
const prisma = new PrismaClient();

exports.getUserAppointments = async (userId) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      userId: parseInt(userId, 10),
    },
  });

  return appointments;
};
