
const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});



let users = [];

//Checking userId and socketId for private Communication
const addUser = (userId, socketId) =>
{
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

//When any User is disconnected or Removed
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
    //When User is connected
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