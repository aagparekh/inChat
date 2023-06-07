const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// const {chats} = require('./data');
const connetDB = require("./config/db");
const { notFound } = require("./middleware/errorMiddleware");
dotenv.config();
connetDB();
const app = express();
app.use(express.json());
let joinedRoom;
// let list_names=[];


app.get("/", (req, res) => {
  res.send("Hello world");
});

// All The User Routes
app.use("/api/user", userRoutes);

// All The Chat Routes
app.use("/api/chat", chatRoutes);

// All The Messages Routes
app.use("/api/message", messageRoutes);

app.use(notFound);
// app.use(errorHandler)
app.use((err, req, res, next) => {
  // Handle the error and send an appropriate response
  res.status(500).json({ error: err.message });
  next();
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});

const io = require('socket.io')(server,{
    pingTimeout: 6000,
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on("connection",(socket)=>{
    console.log(`Connected to Socket.io`);
    
    socket.on('userConnected', (user) => {
      socket.broadcast.emit('userStatusChanged', {  user, status: 'online' });
      // console.log(userId);
    });
    
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        // onlineStatus.push(userData._id);
        socket.emit("connected")
    })

    socket.on("join room", (room,name)=>{
        socket.join(room)
        // console.log(name);
        // socket.to(room).emit("online status",name);
        joinedRoom = room
        console.log("User Join room: "+room);
    })

    socket.on("typing",(room,name)=> {
      console.log(name);
      socket.to(room).emit("typing",name);
    
    })
    socket.on("stop typing",(room)=> socket.to(room).emit("stop typing"))

    socket.on("new message",(newMessageReceived)=>{
        let chat = newMessageReceived.chat;

        if(!chat.users) return console.log("chat.users not defined");

        // socket.to(joinedRoom).emit("message recevied", newMessageReceived);

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message recevied", newMessageReceived);
        });
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('userStatusChanged', { userId: socket.id, status: 'offline' });
    });


  });