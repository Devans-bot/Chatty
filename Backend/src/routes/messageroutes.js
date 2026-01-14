import express from 'express'
import { Isauth } from '../utils/isauth.js'
import { getmessages, getusersforsidebar, sendmessages } from '../controllers/messagecontrollers.js'

const router=express.Router()

router.get("/users",Isauth,getusersforsidebar)
router.post("/send/:id",Isauth,sendmessages)
router.get("/:id",Isauth,getmessages)


export default router