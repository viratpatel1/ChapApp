import mongoose from "mongoose";

const ConverstaionSchema = new mongoose.Schema({
    members: {
        type: Array,
    },
},
    { timestamps: true })

export const ConverstaionModel = mongoose.model("conversationModel", ConverstaionSchema)