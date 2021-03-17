const mongooseLoader = require("./mongooseLoader");
const expressLoader = require("./expressLoader");
module.exports = async (app) => {
  await mongooseLoader();
  console.log("Database connection established");
  await expressLoader(app);
  console.log("Express initialized");
};
