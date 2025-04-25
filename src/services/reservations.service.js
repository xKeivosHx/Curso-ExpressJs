const { PrismaClient } = require("../../prisma/app/generated/prisma/client");
const prisma = new PrismaClient();

exports.createReservation = async (data) => {
  const conflict = await prisma.appointment.findFirst({
    where: {
      date: data.date,
      timeBlockId: data.timeBlockId,
    },
  });

  if (conflict) {
    throw new Error("Time block already reserved");
  }

  return prisma.appointment.create({ data });
};

exports.getReservation = async (id) => {
  const reservation = await prisma.appointment.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      timeBlock: true,
    },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  return reservation;
};

exports.updateReservation = async (data) => {
  const conflict = await prisma.appointment.findMany({
    where: {
      date: data.date,
      timeBlockId: data.timeBlockId,
      id: { not: parseInt(data.id, 10) },
    },
  });

  if (conflict.length > 0) {
    throw new Error("Time block already reserved");
  }

  return prisma.appointment.update({
    where: { id: parseInt(data.id, 10) },
    data,
  });
};

exports.deleteReservation = async (id) => {
  const reservation = await prisma.appointment.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  return prisma.appointment.delete({
    where: { id: parseInt(id, 10) },
  });
};
