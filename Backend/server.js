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
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
