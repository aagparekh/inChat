import React from "react";
import { ChatState } from "../../../context/ChatProvider";
import { Avatar, Box, HStack, Tag, Text } from "@chakra-ui/react";

const GroupList = ({ chat }) => {
  const { User, SelectedChat } = ChatState();
  // console.log(SelectedChat.groupAdmin._id === chat._id);
  return (
    <HStack
      px={4}
      _hover={{ backgroundColor: "#f0f2f5" }}
      // onClick={handleClick}
      cursor={"pointer"}
      backgroundColor={"transparent"}
    >
      <Avatar
        size={"md"}
        cursor={"pointer"}
        name={chat.name === User.name ? "You" : chat.name}
        src={chat.pic}
      ></Avatar>
      <Box p={2} w={"100%"}>
        <Text fontSize={"lg"} display={"flex"} justifyContent={"space-between"}>
          {chat.name === User.name ? "You" : chat.name}
          {SelectedChat.groupAdmin._id === chat._id? <Tag
            size="sm"
            borderWidth="1px"
            borderColor="whatsapp.500"
            color="whatsapp.500"
            mt={1}
          >
            Group Admin
          </Tag>: null}
        </Text>
        <Text color={"blackAlpha.600"}>{"Hey there! I am using inChat.".slice(0,23)+"...."}</Text>
      </Box>
    </HStack>
  );
};

export default GroupList;
