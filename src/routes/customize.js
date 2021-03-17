const express = require("express");
const router = express.Router();
const userModel = require("../models/User")
const customizeModel = require("../models/Customize")
const CustomizeService = require("../services/CustomizeService")
const customizeService = new CustomizeService(customizeModel,userModel)
router.post("/avatar",async (req,res)=>{
    const response = await customizeService.customizeAvatar(req.body)
    return res.json(response)
})
module.exports = router