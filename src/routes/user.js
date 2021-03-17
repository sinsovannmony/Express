const express = require("express");
const router = express.Router();
const userModel = require("../models/User")
const UserService = require("../services/UserService")
const userService = new UserService(userModel)
router.post("/change/username",async (req,res)=>{
    const response = await userService.changeusername(req.body)
    return res.json(response)
})
router.post("/change/password", async (req,res)=> {
    const response = await userService.changepassword(req.body)
    return res.json(response)
})
module.exports = router