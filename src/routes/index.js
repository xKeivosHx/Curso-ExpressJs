const { Router } = require("express");
const authRouter = require("./auth.router");

function routerApi(app) {
  const router = Router();

  router.use("/auth", authRouter);
  app.use("/api", router);
}

module.exports = routerApi;
