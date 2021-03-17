const mongoose = require("mongoose")

const CustomizeSchema = new mongoose.Schema({
    hatStyle:String,
    hairStyle:String,
    hairColor:String,
    glasses:String,
    skinColor:String,
    shirtColor:String,
    pantColor:String,
    gender:String
})  
const CustomizeModel = mongoose.model('Customize',CustomizeSchema)
module.exports = CustomizeModel