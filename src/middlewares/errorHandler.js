const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  const message = error.message || "Ocurrió un error inesperado";

  console.error(
    `Hubo un error: ${new Date().toISOString()} ${statusCode} ${message}`
  );

  if (error.stack) {
    console.error(error.stack);
  }

  const { NODE_ENV } = process.env;

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = errorHandler;
