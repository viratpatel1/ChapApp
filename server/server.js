import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { conversationRoute } from "./routes/conversation.js";
import { messageRoute } from "./routes/message.js";
import { LoginRoute } from "./routes/login.js";
import cookieParser from "cookie-parser";

dotenv.config()

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const PORT = process.env.PORT;

mongoose.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected"))
    .catch(() => console.log("Having Problem in Connection"))
// app.use("/", (req, res) =>
// {
//     res.send("Node")
// })
app.use("/conversation", conversationRoute);
app.use("/message", messageRoute)
app.use("/req", LoginRoute)

app.listen(PORT, () => console.log(`Server start at Port ${PORT}`));