import React from "react";
import "./SingleChat.css";
import { ChatState } from "../../../context/ChatProvider";
import { getSenderName } from "../../../config/ChatSender";
import ChatHeader from "../ChatHeader/ChatHeader";
import { getSenderPic } from "../../../config/ChatSender";
const SingleChat = () => {
  const { User, SelectedChat} = ChatState();
//   console.log(SelectedChat);
  return (
    <>
      <div id="ChatBox-header">
        {SelectedChat
          ? <ChatHeader></ChatHeader>
          : null}
      </div>
    </>
  );
};

export default SingleChat;
