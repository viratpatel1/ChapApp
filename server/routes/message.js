import mongoose from "mongoose";
import express from "express";
// import { ConverstaionModel } from "../models/Conversation.js";
import { MessageModel } from "../models/Message.js";
import Auth from "../middleware/Auth.js";

const router = express.Router();


// For Message

router.post("/", async (req, res) =>
{
    const message = await new MessageModel(req.body)
    await message.save()
        .then((result) =>
        {
            res.status(200).json(result)
            // console.log(result);
        })
        .catch((error) =>
        {
            console.log(error.message);
            res.status(400).json("message Error")
        })
});

router.get("/:messageId", async (req, res) =>
{
    try
    {
        // console.log("cookies ", req.cookies)
        const message = await MessageModel.find({
            conversationId: req.params.messageId,
        });
        // console.log("34 ", message)
        res.status(200).json(message);
    } catch (error)
    {
        console.log("Error")
        res.status(400).json(error.message)
    }
})

export const messageRoute = router;