const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).json({ message: "Invalid data passed into request" });
  }

  try {
    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);

    message = await Message.findById(message._id)
      .populate("sender", "name photo")
      .populate("chat")
      .populate({
        path: "chat.users",
        select: "name photo email",
      });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = expressAsyncHandler(async(req, res)=>{
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate("sender", "name photo email").populate("chat");

        res.status(200).json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports = { sendMessage, allMessages };
