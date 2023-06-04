const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// *************************Route 1**************************

//Creating or Fetching (1-1) Chat

const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "userId param not sent with request" });
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      // matching the objectID from the arrays of objectID referring to user collection
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password") // replacing the user's object Id that was matched with all the user details of that particular ID excluding password
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });
  // console.log(isChat[0]);
  if (isChat.length > 0) {
    res.send(isChat[0]);
  }
  // if the chat doesnt exists then create one
  else {
    var chatData = {
      chatName: "First",
      isGruopChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// *************************Route 1**************************

// *************************Route 2**************************

const fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email pic",
        });
        
        
         return res.status(200).send(results);
        
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// *************************Route 2**************************

// *************************Route 3**************************
const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }
  let users = JSON.parse(req.body.users);
  // console.log(users);
  if (users.length < 2) {
    return res
      .status(400)
      .send({ error: "Group Should Contain more than 2 users" });
  }
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user._id,
    });
    // console.log(groupChat);
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json(fullGroupChat);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});
// *************************Route 3**************************

// *************************Route 4**************************
const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    return res.status(400).json({ error: "Invalid Input" });
  }
  const updatedChatName = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChatName) {
    return res.status(400).json({ error: "Invalid Input" });
  }
  return res.status(200).json(updatedChatName);
});
// *************************Route 4**************************

// *************************Route 5**************************
const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.body;
  let users = JSON.parse(req.body.users);
  if (!chatId || !users) {
    return res.status(400).json({ error: "Invalid Input" });
  }
  const addToGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: users },
    },
    { new: true }
  ).populate("users", "-password")
  .populate("groupAdmin", "-password");

  if (!addToGroup) {
    return res.status(400).json({ error: "Invalid Input" });
  }
  return res.status(200).json(addToGroup);
});

// *************************Route 5**************************

// *************************Route 6**************************
const removeFromGroup = expressAsyncHandler(async(req,res)=>{
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res.status(400).json({ error: "Invalid Input" });
  }
  const removeFromGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  ).populate("users", "-password")
  .populate("groupAdmin", "-password");

  if (!removeFromGroup) {
    return res.status(400).json({ error: "Invalid Input" });
  }
  return res.status(200).json(removeFromGroup);
})

// *************************Route 6**************************


const deleteChats = expressAsyncHandler(async(req,res)=>{
  const {chatId} = req.body;

  const deletechats = await Chat.findByIdAndDelete(chatId).populate("users", "-password");
  return res.status(200).json(deletechats)
})



module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteChats
};
