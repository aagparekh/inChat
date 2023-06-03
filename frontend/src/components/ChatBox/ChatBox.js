import React, { useEffect } from "react";
import "./ChatBox.css";
import { ChatState } from "../../context/ChatProvider";
// import { getSenderName } from "../../config/ChatSender";
import { Box, Center, Flex, Square, Text } from "@chakra-ui/react";
// import { ChatIcon } from "@chakra-ui/icons";
import SingleChat from "../miscellaneous/SingleChat/SingleChat";
import io from "socket.io-client"

const ENDPOINT = "http://localhost:5000";
let socket,SelectedChatCompare;

const ChatBox = () => {
  const {SelectedChat,Messages, setMessages,notification, setnotification,setFetch,Fetch,User} = ChatState();
  // console.log(SelectedChat?.users);
  console.log(SelectedChat);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup",User);
  }, [])
  useEffect(() => {
    socket.on("message recevied",(newMessageReceived)=>{
      console.log(SelectedChat);
     if(!SelectedChatCompare || SelectedChatCompare._id !== newMessageReceived.chat._id) {
       if(!notification.includes(newMessageReceived)){
         setnotification([newMessageReceived,...notification]);
         setFetch(!Fetch);
       }
     }
     else{
       setMessages([...Messages,newMessageReceived]);
     }
      console.log(newMessageReceived);
    }) 
  
   })
   useEffect(() => {
     SelectedChatCompare = SelectedChat;
   }, [SelectedChat])
   
   console.log(notification);
  return (
    <>
      {SelectedChat ? (
        <SingleChat socket={socket}></SingleChat>
      ) : (
        <Flex
          h={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <i
            class="fa-sharp fa-regular fa-comments"
            style={{ fontSize: "80px", color: "#00a884de" }}
          ></i>
          {/* <ChatIcon boxSize={20} color={"#41525d"} style={{ fontWeight: 100, opacity: 0.5 }}></ChatIcon> */}
          <Text
            fontFamily={"sans-serif"}
            color={"#00a884de"}
            fontSize={"32px"}
            fontWeight="100"
          >
            inChat App
          </Text>
          <Text fontSize={"16px"} color={"#667781"}>
            Start chatting with your friends and loved ones by selecting their
            chat using inChat web app.
          </Text>
        </Flex>
      )}
      {/*   */}
    </>
  );
};

export default ChatBox;
