import React, { useEffect, useRef, useState } from "react";
import "./SingleChat.css";
import { ChatState } from "../../../context/ChatProvider";
import { getSenderName } from "../../../config/ChatSender";
import ChatHeader from "../ChatHeader/ChatHeader";
import { getSenderPic } from "../../../config/ChatSender";
import {
  Box,
  Center,
  Flex,
  FormControl,
  Input,
  Spacer,
  Spinner,
  Square,
  Text,
} from "@chakra-ui/react";
import ScrollableChat from "../../ScrollableChat/ScrollableChat";
const SingleChat = () => {
  const { User, SelectedChat } = ChatState();
  const [Messages, setMessages] = useState([]);
  const [SpinnerLoading, setSpinnerLoading] = useState(false);
  const [newMessage, setnewMessage] = useState();
  const containerRef = useRef(null);
  const fetchAllMessage = async()=>{
    if (!SelectedChat) return;
    setSpinnerLoading(true)
    try {
      const response = await fetch(`/api/message/${SelectedChat._id}`,{
        method: 'GET',
        headers: {
          Authorization: `Bearer ${User.token}`,
        },
      });
      const data = await response.json();
      setMessages(data)
      // console.log(data);
      setSpinnerLoading(false)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchAllMessage();
    return () => {
    }
  }, [SelectedChat])

  useEffect(() => {
    scrollToBottom();
  }, [Messages]);
  
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  const sendMessageOnEnter = async(event)=>{
    // console.log("sendMessageOnEnter is triggered");
    if((event.key === 'Enter' && newMessage) || ( event.type === 'click' && newMessage)){
      try {
        const body = {
          content: newMessage,
          chatId : SelectedChat._id
        }
        const response = await fetch('/api/message/',{
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${User.token}`,
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        // console.log(data);
        setnewMessage("");
        setMessages([...Messages, data]);
      } catch (error) {
        console.log(error)
      }
    }
  }
  const typingHandler = (e)=>{
    setnewMessage(e.target.value)
  }
  //   console.log(SelectedChat);
  return (
    <>
      <div id="ChatBox-header">
        {SelectedChat ? <ChatHeader></ChatHeader> : null}
      </div>
      <Box
        h={"80.2%"}
        px={'63px'}
        pb={'8px'}
        pt={6}
        overflowY={'scroll'}
        ref={containerRef}
      >
        {SpinnerLoading ? (
          <Square w={"100%"} h={"100%"}>
            <Spinner
              thickness="3px"
              speed="0.65s"
              emptyColor="gray.200"
              color="whatsapp.500"
              size="xl"
            />
          </Square>
        ) : Messages.length>0? (
          <Flex flexDirection={'column'}          
          >
            <ScrollableChat messages = {Messages}/>
          </Flex>
        ): 
        <Text textAlign={'center'} color={'blackAlpha.600'}>Say hii to your buddy {getSenderName(User,SelectedChat.users)} .... </Text>
        }
      </Box>

      <Flex
        h={"64px"}
        backgroundColor={"#f0f2f5"}
        id="messageInput"
        justifyContent={"center"}
        alignItems={"center"}
        p={2}
      >
        <FormControl
        onKeyDown={sendMessageOnEnter}
        isRequired
        >
        <Input
          placeholder="Type a message"
          size={"lg"}
          backgroundColor={"white"}
          w={"92%"}
          onChange={typingHandler}
          value={newMessage}
          ml={3}
        />
        <i
          className="fa-solid fa-paper-plane icon"
          style={{
            fontSize: "25px",
            color: "#00a884de",
            marginLeft: "21px",
            cursor: "pointer",
          }}
          onClick={sendMessageOnEnter}
        ></i>
        </FormControl>
      </Flex>
    
    </>
  );
};

export default SingleChat;
