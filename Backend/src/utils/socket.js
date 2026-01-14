import {Server } from"socket.io"
import http from "http"
import express from "express"


const app=express()
const server=http.createServer(app)


const io=new Server(server,{
    cors:{
        origin:true,
        credentials:true,
    },
});


const userSocketMap={}

export {userSocketMap}

io.on("connection",(socket)=>{

    console.log("A user connected ",socket.id);
    const userId = socket.handshake?.auth?.userId;


if(userId) {
  userSocketMap[userId]=socket.id;
}

io.emit("getOnlineUsers", Object.keys(userSocketMap));

socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });


});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};



export {io,app,server}