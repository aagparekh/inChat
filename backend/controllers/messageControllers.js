const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");



const sendMessage = expressAsyncHandler(async(req,res)=>{
    const {content,chatId} = req.body;

    if(!content || !chatId){
        console.log("Invalid Data passed into request");
        return res.status(400).json({error: "Invalid Data passed into request"});
    }
    let newMessage = {
        sender : req.user._id,
        content : content,
        chat : chatId
    };
    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message,{path: "chat.users", select: "name pic email"});

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage : message,
        });
       return res.status(200).json(message)
    } catch (error) {
        // console.log(error);
        return res.status(400).json({error: error});
    }

});

const allMessages = expressAsyncHandler(async(req,res)=>{
try {
    const messages = await Message.find({chat : req.params.chatId}).populate("sender","name pic").populate("chat");
    return res.status(200).json(messages)
} catch (error) {
    return res.status(404).json({error: error});
}
})

module.exports = {sendMessage,allMessages}