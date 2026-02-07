import mongoose, { mongo, Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // the one who is subscribing
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // the one whose channel is being subscribed
    }
}, { timestamps })

export const Subscription = mongoose.model("Subscription", subscriptionSchema)