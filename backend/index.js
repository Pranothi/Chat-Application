const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000;

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

io.on('connection', (socket)=>{
    socket.on('join', (data)=>{
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('user joined');
    });

    socket.on('message', (data)=>{
        io.in(data.room).emit('new message', {user:data.user, message: data.message});
    })
})
  