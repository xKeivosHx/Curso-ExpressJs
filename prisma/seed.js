const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  // Eliminar datos existentes
  await prisma.appointment.deleteMany();
  await prisma.timeBlock.deleteMany();
  await prisma.user.deleteMany();

  // Reiniciar contadores de secuencia (PostgreSQL)
  await prisma.$executeRawUnsafe(
    `SELECT setval('"Appointment_id_seq"', 1, false)`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('"TimeBlock_id_seq"', 1, false)`
  );
  await prisma.$executeRawUnsafe(`SELECT setval('"User_id_seq"', 1, false)`);

  // Crear usuarios
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: bcrypt.hashSync("password", 10),
      role: "ADMIN",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: bcrypt.hashSync("1234", 10),
      role: "USER",
    },
  });

  // Crear bloques de tiempo
  const timeBlock1 = await prisma.timeBlock.create({
    data: {
      startTime: new Date("2025-04-23T09:00:00Z"),
      endTime: new Date("2025-04-23T10:00:00Z"),
    },
  });

  const timeBlock2 = await prisma.timeBlock.create({
    data: {
      startTime: new Date("2025-04-23T10:00:00Z"),
      endTime: new Date("2025-04-23T11:00:00Z"),
    },
  });

  // Crear cita
  await prisma.appointment.create({
    data: {
      date: new Date("2025-04-23"),
      userId: regularUser.id,
      timeBlockId: timeBlock1.id,
    },
  });

  console.log("Seed ejecutado con éxito");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
