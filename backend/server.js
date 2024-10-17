import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const server = http.createServer(app);

const __dirname1 = path.resolve();
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname1, "/frontend/build")))

    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    })
}else{
    app.get('/', (req, res)=>{
        res.send("API is running Successfully")
    })
}

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000'
    }
});
console.log("The frontend url is: ", process.env.FRONTEND_URL);
console.log("The process.env is: ", process.env.PORT);
const PORT = process.env.PORT || 5000;


let rooms = [];
let room = 0;
let roomId=-1;
let roomSet = new Set();

io.on('connection', (socket)=>{
    console.log("A user connected");
    
    if(rooms.length){
        roomId = rooms[0];
    }else{
        roomId = room++;
        roomSet.add(roomId);
        rooms.unshift(roomId);
    } 
    socket.join(roomId);
    const usersInRoom = io.sockets.adapter.rooms.get(roomId);
    const userCount = usersInRoom ? usersInRoom.size : 0;
    if(userCount==2){
        roomSet.delete(rooms[0]);
        rooms.shift();
    }


    console.log("userCount: ", userCount);
    console.log('Roomid: ', roomId);
    socket.emit('getRoom', roomId)

    socket.roomId = roomId;

    // console.log(`UsersInROoM: ${roomId} : `, userCount);
    io.to(roomId).emit('user count', userCount);


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
        const usersInRoom = io.sockets.adapter.rooms.get(socket.roomId);
        const userCount = usersInRoom ? usersInRoom.size : 0;
        console.log("USerInRoom: ", usersInRoom);
        console.log("userCount during disconnection:", userCount);
        
        io.to(socket.roomId).emit('roomStatus', "User left");

        console.log("A user disconnected from room: ", socket.roomId);
    })
})


server.listen(PORT, ()=>{
    console.log("The app is running on port: ", PORT);
})