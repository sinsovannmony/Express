const mongoose = require("mongoose");
module.exports = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return connection.connection.db;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
