//Requires path to server
const path = require('path');
//Used by express under the hood
const http = require('http');
//Regular express server
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

//Application Variable
const app = express();
//Passes in variable
const server = http.createServer(app);
const io = socketio(server);

//Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ComicSpace Bot'

//Run when a client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ComicSpace!'));

        //Broadcast when a user connects to the chat
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the space!`));

        //Send users and room information
        io.to(user.room).emit('roomusers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Listen for chat message
    socket.on('chatMessage', msg => {
        const user =getCurrentUser(socket.id);
        
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    })

    //Runs when client disconnects
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the space!`));

            //Send users and room information
            io.to(user.room).emit('roomusers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        }

    });
});

//Looks to see if 3000 or enviroment variable is available
const PORT = 3000 || process.env.PORT;

//Call listen to run a server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
