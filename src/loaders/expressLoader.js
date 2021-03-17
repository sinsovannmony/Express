const express = require("express");
const cors = require("cors");
const checkToken = require("../utilities/checkToken")
const authRouter = require("../routes/auth");
const roomRouter = require("../routes/room");
const userRouter = require("../routes/user");
const customizeRouter = require("../routes/customize");
module.exports = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use("/auth",authRouter);
  app.use("/room",checkToken,roomRouter);
  app.use("/user",checkToken,userRouter);
  app.use("/customize",checkToken,customizeRouter);
};
