import express from 'express'
import { addfriend,  allfriends,  checkauth, friendRequests, getfriend, getuserprofile, login, logout, profilepic, removeRequests, sendrequest, signup } from '../controllers/usercontrollers.js'
import { Isauth } from '../utils/isauth.js'

const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/allfrnds",Isauth,allfriends)
router.post("/profilepic",Isauth,profilepic)
router.get("/checkauth",Isauth,checkauth)
router.get("/removeRequests",Isauth,removeRequests)
router.post("/searchuser",Isauth,getfriend)
router.get("/requests",Isauth,friendRequests)
router.get("/userprofile/:id",Isauth,getuserprofile)
router.get("/addfriend/:id",Isauth,addfriend)
router.get("/sendrequest/:id",Isauth,sendrequest)


export default router