import express from "express";
import payload from "payload";
import apiRouter from "./api/root";

require("dotenv").config();

const app = express();

app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.use("/api/v1", apiRouter);

  app.listen(3000);
};

start();
