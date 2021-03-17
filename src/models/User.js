const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    gender:String,
    activated:{
        type:Boolean,
        default:false
    },
    confirm:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Confirm'
    },
    customize:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customize'
    }
})  
const UserModel = mongoose.model('User',UserSchema)
module.exports = UserModel