import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { getSenderName, getSenderPic } from "../../../config/ChatSender";
import { ChatState } from "../../../context/ChatProvider";

const ChatHeader = () => {
  const { User, SelectedChat } = ChatState();
  console.log(SelectedChat.users);
  return (
    <Flex alignItems="center">
      {SelectedChat.isGroupChat ? (
        <>
          <Box p="2" mx={1}>
            <Avatar
              size={"md"}
              cursor={"pointer"}
              name={SelectedChat.chatName}
              bg={"#f0f2f5"}
              color={"black"}
            ></Avatar>
          </Box>
          <Box>
            <Text color={"white"} fontSize={"18px"} fontWeight={"semibold"}>
              {SelectedChat.chatName}
            </Text>
            <Flex>
              {SelectedChat.users.map((user, index) => {
                const isLastUser = index === SelectedChat.users.length - 1;
                return (
                  <Text
                    key={user._id}
                    color="white"
                    fontSize="15px"
                    fontWeight="normal"
                    mr={1}
                  >
                    {user.name === User.name? "You" : user.name}
                    {!isLastUser && ","}
                  </Text>
                );
              })}
            </Flex>
          </Box>
        </>
      ) : (
        <>
          <Box p="2" mx={1}>
            <Avatar
              size={"md"}
              cursor={"pointer"}
              name={getSenderName(User, SelectedChat?.users)}
              src={getSenderPic(User, SelectedChat?.users)}
              as={"button"}
              //   onClick={profileHandler}
            ></Avatar>
          </Box>
          <Text color={"white"} fontSize={"18px"} fontWeight={"semibold"}>
            {getSenderName(User, SelectedChat?.users)}
          </Text>
        </>
      )}
    </Flex>
  );
};

export default ChatHeader;
