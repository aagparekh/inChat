import { Avatar, Box, HStack, Heading, Square, Text } from "@chakra-ui/react";
import React from "react";

const chatList = ({ chat, openChat }) => {
  return (
    <>
      <HStack
        px={4}
        _hover={{ backgroundColor: "#f0f2f5" }}
        onClick={openChat}
        cursor={"pointer"}
      >
        {chat.isGroupChat ? (
          <>
          <Avatar
            size={"md"}
            cursor={"pointer"}
            name={chat.chatName}
          ></Avatar>
          <Box
            p={2}
            w={"100%"}
            borderBottom={"2px"}
            borderBottomColor={"gray.200"}
          >
            <Text fontSize={"lg"}>{chat.chatName}
              <i class="fa-solid fa-user-group" style={{ color: "#00a884de", marginLeft: '8px' }}></i>
           </Text>
            <Text color={"blackAlpha.600"}>Message Yourself</Text>
            
          </Box>
        </>
        ) : (
          <>
            <Avatar
              size={"md"}
              cursor={"pointer"}
              name={"Aagam Parekh"}
              src={chat.pic?chat.pic:chat.users[1].pic }
            ></Avatar>
            <Box
              p={2}
              w={"100%"}
              borderBottom={"2px"}
              borderBottomColor={"gray.200"}
            >
              <Text fontSize={"lg"}>{chat.name?chat.name : chat.users[1].name}</Text>
              <Text color={"blackAlpha.600"}>Message Yourself</Text>
            </Box>
          </>
        )}
      </HStack>
      {/* <HStack px={4} _hover={{backgroundColor: '#f0f2f5'}}>
    <Avatar
            size={"md"}
            cursor={"pointer"}
            name={"Aagam Parekh"}
          ></Avatar>
          <Box p={2} w={'100%'} borderBottom={'2px'} borderBottomColor={'gray.200'}>
              <Text fontSize={'lg'}>Aagam</Text>
              <Text color={'blackAlpha.600'}>Message Yourself</Text>
          </Box>
  </HStack> */}
    </>
  );
};

export default chatList;
