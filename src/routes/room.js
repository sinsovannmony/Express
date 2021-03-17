const express = require("express");
const router = express.Router();
const roomModel = require("../models/Room")
const RoomService = require("../services/RoomService")
const roomService = new RoomService(roomModel)
router.post("/create/public/room",async (req,res)=>{
    const response = await roomService.createpublicroom(req.body)
    return res.json(response)
})
router.post("/create/private/room",async (req,res)=>{
    const response = await roomService.createprivateroom(req.body)
    return res.json(response)
})
router.post("/check/room", async (req,res)=> {
    const response = await roomService.checkroom(req.body)
    return res.json(response)
})
router.post("/join/room", async (req,res)=> {
    const response = await roomService.joinroom(req.body)
    return res.json(response)
})
router.post("/delete/room", async (req,res)=> {
    const response = await roomService.deleteroom(req.body)
    return res.json(response)
})
module.exports = router