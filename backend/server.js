const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
// const {chats} = require('./data');
const connetDB = require('./config/db');
const {notFound} = require('./middleware/errorMiddleware')
dotenv.config();
connetDB();
const app = express();
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Hello world")
})

// All The User Routes
app.use('/api/user', userRoutes);


// All The Chat Routes
app.use('/api/chat', chatRoutes);


app.use(notFound);
// app.use(errorHandler)
app.use((err, req, res, next) => {
    // Handle the error and send an appropriate response
    res.status(500).json({ error: err.message });
    next();
  });

const PORT = process.env.PORT || 5000; 

app.listen(PORT, ()=>{
    console.log(`Server Started on port ${PORT}`)
} 
);