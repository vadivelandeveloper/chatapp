const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/message');
const{userJoin, getuser,getRoomUsers,userLeaves}= require('./utils/user')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botname = 'Vadivelan'
//middle wares

//Static path.
app.use(express.static(path.join(__dirname, 'public')))


io.on('connection', socket => {
    console.log("new Connection has been made.");

    socket.on('joinRoom', (username, room) => {
        const user = userJoin(socket.id,username,room);
        console.log(user);
        socket.join(user.room);

        socket.emit('message', formatMessage(botname, 'Welcome to vadivelan Chat app'));
        socket.broadcast.to(user.room).emit('tost', formatMessage(botname, `${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        });

    })
    // console.log("Socket",socket);

    socket.on('disconnect', () => {
        const user = userLeaves(socket.id)
        if(user){
            io.to(user.room).emit('tost', formatMessage(botname, `${user.username} has left the room`));
        
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users: getRoomUsers(user.room)
            });
        }
    })
    socket.on('chatmessage', (msg) => {
        console.log("message", msg);
        const user =  getuser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

})
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
    console.log("server running on port", PORT);
}) 