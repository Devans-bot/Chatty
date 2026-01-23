import express from 'express'
 import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userroutes from './routes/userroutes.js'
import deviceroutes from './routes/deviceroutes.js'
import messageroutes from './routes/messageroutes.js'
import keyroutes from './routes/keyroutes.js'
import connectDB from './lib/database.js'
import cors from 'cors'
import {io,app,server} from "./utils/socket.js"
import path from "path";
import { fileURLToPath } from "url";


dotenv.config()
app.use(cors({
  origin: true,
  credentials: true,
}));

const port=process.env.PORT
app.use(express.json({limit:"10mb"}));                // parse application/json
app.use(express.urlencoded({ extended: true })); 


app.use(cookieParser())
app.use("/api/user",userroutes)
app.use("/api/chat",messageroutes)
app.use("/api/chat",keyroutes)
app.use("/api/device", deviceroutes)





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve frontend
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../../Frontend/dist/index.html")
  );
});


server.listen(port,()=>{
 console.log("Server running on "+port)
 console.log(port)
 connectDB()
})