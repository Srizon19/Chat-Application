const express = require("express");
const chats = require("./dummy.js");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes.js');

const { notFound, errorHandler } = require('./middlewares/errorMiddleware.js');

const app = express();
app.use(express.json());

dotenv.config();
connectDB();



app.get('/', (req, res) => {
    res.send(`API is running successfully`);
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
// error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:5173",
    }
})

io.on("connection", (socket)=>{
    console.log("connected to socket.io");

    socket.on('setup', (userData)=>{
        socket.join(userData._id);
        // console.log("user data sent from fronten to socket: ", userData)
        socket.emit("connected");

    })

    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("user joined room:  ", room)
    })
    socket.on("new message", (newMessageReceived) => {
    console.log("New message received:", newMessageReceived);

    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((userId) => {
        // Skip the sender
        if (userId === newMessageReceived.sender._id) return;

        console.log("Emitting to user:", userId);
        socket.in(userId).emit("message received", newMessageReceived);
        });
    });

})
