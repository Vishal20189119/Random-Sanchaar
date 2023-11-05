import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    // pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
});
const PORT = 5000;


let rooms = [];
let room = 0;
let roomId=-1;
var users = 0;
let roomSet = new Set();

io.on('connection', (socket)=>{
    users++;
    console.log("users: ", users);
    console.log("A user connected");

    if(rooms.length){
        roomId = rooms[0];
    }else{
        roomId = room++;
        roomSet.add(roomId);
        rooms.unshift(roomId);
    } 

    if(users>=2){
        users = 0;
        roomSet.delete(rooms[0]);
        rooms.shift();
    }
    console.log("ROOMS: ", rooms);
    console.log("RoomSet: ", roomSet);
    console.log("roomId: ", roomId);
    socket.join(roomId);
    socket.emit('getRoom', roomId)

    socket.roomId = roomId;
    


    socket.on('message', (message)=>{
        // console.log(socket.id);
        console.log(message.content, roomId)
        // io.emit('message', message)
        io.to(message.roomId).emit('message', message);
    })

    socket.on('disconnect', ()=>{
        if(!roomSet.has(socket.roomId)){
            rooms.push(socket.roomId)
            roomSet.add(socket.roomId);
        } 
        io.to(socket.roomId).emit('roomStatus', "User left");

        console.log("A user disconnected from room: ", socket.roomId);
    })
})


server.listen(PORT, ()=>{
    console.log("The app is running on port: ", PORT);
})