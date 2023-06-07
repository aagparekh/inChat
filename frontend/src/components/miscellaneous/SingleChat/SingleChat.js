import React, { useEffect, useRef, useState } from "react";
import "./SingleChat.css";
import { ChatState } from "../../../context/ChatProvider";
import { getSenderName } from "../../../config/ChatSender";
import ChatHeader from "../ChatHeader/ChatHeader";
// import { getSenderPic } from "../../../config/ChatSender";
import {
  Box,
  // Center,
  Flex,
  FormControl,
  Input,
  // Spacer,
  Spinner,
  Square,
  Text,
} from "@chakra-ui/react";
import ScrollableChat from "../../ScrollableChat/ScrollableChat";

// const ENDPOINT = "http://localhost:5000";
// let SelectedChatCompare;


const SingleChat = ({socket,socketConnected}) => {
  const { User, SelectedChat,Fetch,setFetch,CurrentUserChat,Messages,setMessages,setOnlineUsers,OnlineUsers} = ChatState();
  const [SpinnerLoading, setSpinnerLoading] = useState(false);
  const [newMessage, setnewMessage] = useState();
  const containerRef = useRef(null);
  const [Typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const [TyperName, setTyperName] = useState('')
  // const [onlineName, setOnlineName] = useState('');


  useEffect(() => {
    // console.log(socket);
    socket.on("typing", (name)=>{
      console.log(name);
      setisTyping(true); 
      setTyperName(name);
      // console.log(OnlineUsers.includes(name));
      if(OnlineUsers.includes(name) === false)
      {
        setOnlineUsers([...OnlineUsers,name]);
      }
     });
    socket.on("stop typing", ()=>setisTyping(false))
    // socket.on("online status",(name)=>setOnlineName(name))
    }, [])
    
    // console.log(TyperName);
  // useEffect(() => {
  //  socket.on("message recevied",(newMessageReceived)=>{

  //   if(!SelectedChatCompare || SelectedChatCompare._id !== newMessageReceived.chat._id) {
  //     if(!notification.includes(newMessageReceived)){
  //       setnotification([newMessageReceived,...notification]);
  //       setFetch(!Fetch);
  //     }
  //   }
  //   else{
  //     setMessages([...Messages,newMessageReceived]);
  //   }

  //  }) 
  // })

  // console.log(notification);
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

      socket.emit("join room",SelectedChat._id,User.name);
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
        socket.emit("new message",data);
        setMessages([...Messages, data]);
        if(SelectedChat._id !== CurrentUserChat[0]._id){
          setFetch(!Fetch);
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  
  const typingHandler = (e)=>{
    setnewMessage(e.target.value)

    if(!socketConnected) return;

    if(!Typing){
      setTyping(true);
      console.log(User.name);
      socket.emit("typing",SelectedChat._id,User.name);
    }
    let lastTypingTime = new Date().getTime();
    var timeLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if(timeDiff >= timeLength){
        socket.emit("stop typing", SelectedChat._id);
        setTyping(false)
      }
    }, 3000);
  }
  //   console.log(SelectedChat);
  return (
    <>
      <div id="ChatBox-header">
        {SelectedChat ? <ChatHeader isTyping = {isTyping} name = {TyperName}></ChatHeader> : null}
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
          {/* {isTyping ? <div>Loading...</div> : null} */}
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
