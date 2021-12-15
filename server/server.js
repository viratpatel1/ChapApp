import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { conversationRoute } from "./routes/conversation.js";
import { messageRoute } from "./routes/message.js";
import { LoginRoute } from "./routes/login.js";
import cookieParser from "cookie-parser";
// import { io } from "socket.io"
// import { socketio } from "socket.io";
// import App from "ws";
import { Server } from 'socket.io';
import { createServer } from 'http';
dotenv.config()


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const PORT = process.env.PORT || 4000;

// const server = require("http").createServer(handler);
const httpServer = createServer(app);
// const io = new Server();
// const socketio = new Server(server);
const io = new Server(httpServer, {
    cors: {
        // origins: 'http://localhost:3000/',
        origins: 'https://chatsapps.netlify.app/',
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});


// io.on(process.env.PORT || 4000, {
//     cors: {
//         // origin: "https://chatsapps.netlify.app/",
//         origin: "http://localhost:3000/",
//     },
// });




let users = [];

// Checking userId and socketId for private Communication
const addUser = (userId, socketId) =>
{
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

// When any User is disconnected or Removed
const removeUser = (socketId) =>
{
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) =>
{
    return users.find((user) => user.userId === userId);
}

io.on("connection", (socket) =>
{
    // When User is connected
    console.log("a user Connected");

    // Take userId and socketId from user
    socket.on("addUser", userId =>
    {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    // Send And Get Message
    socket.on("sendMessage", ({ senderId, receiverId, text }) =>
    {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    // When User is disconnected
    socket.on("disconnect", () =>
    {
        console.log("a user is disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);

    });
});

mongoose.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected"))
    .catch(() => console.log("Having Problem in Connection"))


app.use("/conversation", conversationRoute);
app.use("/message", messageRoute);
app.use("/req", LoginRoute);

app.use("/", (req, res) =>
{
    res.send("Server is Starteds")
})

httpServer.listen(PORT, () => console.log(`Server start at Port ${PORT}`))