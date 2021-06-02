const path=require('path');
const fs = require('fs');
const https=require('https');
const express=require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers,get_socket_id,need_key}=require('./utils/users');
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
const app=express();
const server=https.createServer(options,app);
const io=socketio(server);
//set statc folder
app.use(express.static(path.join(__dirname,'public')));


//run when client connects
io.on('connection',(socket)=>{
    socket.on('joinRoom',(user_data)=>{
        const user=userJoin(socket.id,user_data.username,user_data.room,user_data.pub_key);
        socket.join(user.room);
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
        if(need_key(user_data.room)) io.to(socket.id).emit('Server_Response',{T_KEY:0}); 
        else io.to(get_socket_id(user_data.room)).emit('send_T_KEY',{ 
            ID: socket.id,
            PubKey: user_data.pub_key
        })
        socket.to(user.room).emit('announce',formatMessage(`${user.username}`,'has joined the server'));
    });
    socket.on('Thread_Key',({ID,Key})=>{
        io.to(ID).emit('Server_Response',({T_KEY:Key}));
    });


    //runs when client disconnect
    socket.on('disconnect',function(){
        const user=userLeave(socket.id);
        if(user){
            //send user and room info
            io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
            })
            socket.to(user.room).emit('announce',formatMessage(`${user.username}`,'has left the server'));
        }
    })
    //listen for chat message
    socket.on('chatMessage',(msg)=>{
        console.log('A message received');
        var user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(`${user.username}`,msg));
    })

})

const PORT=3000||process.env.PORT;
server.listen(PORT,function(){
    console.log(`online ${PORT}`);
})