const express = require("express");
const router = express.Router();
const userModel = require("../models/User")
const confirmModel = require('../models/confirm')
const customizeModel = require('../models/Customize')
const AuthService = require("../services/AuthService")
const authService = new AuthService(userModel,confirmModel,customizeModel)
router.post("/register",async (req,res)=>{
    const response = await authService.register(req.body)
    return res.json(response)
})
router.post("/confirm/email", async (req,res)=> {
    const response = await authService.confirmEmail(req.body)
    return res.json(response)
})
router.post("/login",async (req,res)=>{
    const response = await authService.login(req.body)
    return res.json(response)
})
router.post("/forgot/password",async (req,res)=>{
    const response = await authService.forgotPassword(req.body)
    return res.json(response)
})
router.post("/confirm/reset",async (req,res)=>{
    const response = await authService.confirmReset(req.body)
    return res.json(response)
})


module.exports = router