const express=require('express') ;//creating express server
const app=express(); 
const server=require('http').Server(app); //creating a server to be used with socket.io
const io=require('socket.io')(server);
const {v4:uuidV4}=require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
app.set('view engine','ejs');
app.use('/peerjs', peerServer);
app.use(express.static('public'));
let a=uuidV4();
// app.use('/peerjs', peerServer);
app.get('/',(req,res)=>{
    res.render('index');
    // dynamic room where need to redirect
})
app.get('/meeting',(req,res)=>{
  res.redirect(`${uuidV4()}`);
})
app.get('/:room',(req,res)=>{
  res.render('room',{roomId:req.params.room});
})

// app.get('/:room',(req,res)=>{
//     res.render('room',{roomId:req.params.room})
//     // The second parameter is storing id in roomsID and making it available to view
// })
// io.on will run every time someone connects to our web server.socket is something that user connects to

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId,username)=>{
         socket.join(roomId);
        //  console.log(roomId);
        //  socket.to(roomId).broadcast.emit('user-connected',userId);
        // replacing this with newer version

        io.to(roomId).emit('user-connected', userId,username);
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message,username);
        })
        socket.on('disconnect',()=>{
            io.to(roomId).emit('user-disconnected', userId,username);
        })
    })
})
server.listen(process.env.PORT||443); 

