const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  description:
  {
    type: String,
  },
  isprivate:{
    type:Boolean,
    default:false
  }

});

const RoomModel = mongoose.model("Room", RoomSchema);

module.exports = RoomModel;