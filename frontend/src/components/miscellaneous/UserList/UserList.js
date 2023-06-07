import {
  Avatar,
  Box,
  Circle,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { getSenderName, getSenderPic } from "../../../config/ChatSender";
import { ChatState } from "../../../context/ChatProvider";
// import { LayoutGroup } from "framer-motion";

const UserList = ({ chat, handleClick }) => {
  const { User, SelectedChat, notification} = ChatState();
  // console.log(chat.isGroupChat);
  // console.log(chat);
  const getCount = () => {
    let count = 0;
    if (notification.length === 0) return count;

    notification.forEach((n) => {
      if (n.chat._id === chat._id) {
        count += 1;
      }
    });

    return count;
  };

  const count = getCount();

  

  return (
    <>
      <HStack
        px={4}
        _hover={{ backgroundColor: "#f0f2f5" }}
        onClick={handleClick}
        cursor={"pointer"}
        backgroundColor={
          SelectedChat?._id === chat._id ? "#f0f2f5" : "transparent"
        }
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
              display={"flex"}
              alignItems={"center"}
            >
              <Box display={"flex"} flexDirection={"column"}>
              <Text fontSize={"lg"}>
                {chat.chatName}
                <i
                  class="fa-solid fa-user-group"
                  style={{ color: "#00a884de", marginLeft: "8px" }}
                ></i>
              </Text>
              {
                chat.latestMessage ? <Text color={"blackAlpha.600"} noOfLines={1}>{chat.latestMessage.sender.name === User.name? "~ You"+": "+ chat.latestMessage.content : "~ "+chat.latestMessage.sender.name+": "+ chat.latestMessage.content }</Text>:
                <Text color={"blackAlpha.600"}>Message Yourself</Text>
                }
              
              </Box>
              <Spacer/>
              {count > 0 ? (
                <Circle fontSize={"12px"} fontWeight={"bold"} size="20px" bg="whatsapp.500" color="white">
                  {count}
                </Circle>
              ) : null}


            </Box>
          </>
        ) : (
          <>
            <Avatar
              size={"md"}
              cursor={"pointer"}
              name={chat.name ? chat.name : getSenderName(User, chat.users)}
              src={chat.pic ? chat.pic : getSenderPic(User, chat.users)}
            ></Avatar>
            <Box
              p={2}
              w={"100%"}
              borderBottom={"2px"}
              borderBottomColor={"gray.200"}
              display={"flex"}
              alignItems={"center"}
            >
              <Box display={"flex"} flexDirection={"column"}>
                <Text fontSize={"lg"}>
                  {chat.name ? chat.name : getSenderName(User, chat.users)}
                </Text>
                {
                chat.latestMessage ? <Text color={"blackAlpha.600"}>{chat.latestMessage.content}</Text>:
                <Text color={"blackAlpha.600"}>Message Yourself</Text>
                }
              </Box>
              <Spacer />
              {/* {console.log(chat.chatName + count)} */}
              {count > 0 ? (
                <Circle fontSize={"12px"} fontWeight={"bold"} size="20px" bg="whatsapp.500" color="white">
                  {count}
                </Circle>
              ) : null}
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

export default UserList;
