const loaders = require("./loaders");
const express = require("express");
require("dotenv").config();
const startServer = async () => {
  const PORT = process.env.PORT;
  const app = express();
  await loaders(app);
  app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
};
startServer();
