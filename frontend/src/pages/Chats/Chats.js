import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Flex } from "@chakra-ui/react";
import MyChat from "../../components/MyChat/MyChat";
import ChatBox from "../../components/ChatBox/ChatBox";
import './Chats.css'
const Chats = () => {
  const {User} = ChatState(); 
  return (
    <Flex id="chats"
    p={3}
    >
    <Box bg={"White"}
    flex={1.2/3}
    // border={"1px"}
    height="91vh"
    // borderRadius="md"
    boxShadow="0px 8px 12px rgba(0, 0, 0, 0.1)"
    >
        {User && <MyChat/>}
    </Box>
    <Box
    flex={1}
    height={'91vh'}
    bg={"#f8f8f8"}
    boxShadow="0px 8px 12px rgba(0, 0, 0, 0.1)"
    overflow={'hidden'}
    >
        {User && <ChatBox/>}
        
    </Box>
    </Flex>
  );
};

export default Chats;
