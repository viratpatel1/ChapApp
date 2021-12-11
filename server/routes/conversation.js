import express from "express";
import { ConverstaionModel } from "../models/Conversation.js";
import { passform } from "../models/passmodel.js";

const router = express.Router();


// For Converstaion

router.get("/", async (req, res) =>
{
    // res.send("datas")
    await ConverstaionModel.find()
        .then((re) => res.send(re))
        .catch((err) => res.send(err));

})

router.post("/", async (req, res) =>
{
    const newConversation = await new ConverstaionModel({
        members: [req.body.senderId, req.body.receiverId],
    });
    await newConversation.save()
        .then(() =>
        {
            console.log("Done ", newConversation);
            res.status(200).json("Do1ne")
        })
        .catch(() => console.log("Error"));
});

router.get("/:userId", async (req, res) =>
{
    try
    {
        const converstaion = await ConverstaionModel.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(converstaion)
        console.log("33 ", converstaion)

    } catch (error)
    {
        res.status(400).json(error);
    }
});

// get conversation with 2 user ID
router.get("/find/:firstuserId/:seconduserId", async (req, res) =>
{
    try
    {
        const converstaion = await ConverstaionModel.findOne({
            members: { $all: [req.params.firstuserId, req.params.seconduserId] },
        });
        res.status(200).json(converstaion)
        // console.log("33 ", converstaion)

    } catch (error)
    {
        res.status(400).json(error);
    }
});



export const conversationRoute = router;