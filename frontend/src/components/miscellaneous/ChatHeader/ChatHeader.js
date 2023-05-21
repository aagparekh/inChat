import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { getSenderName, getSenderPic } from "../../../config/ChatSender";
import { ChatState } from "../../../context/ChatProvider";
import RightSideDrawer from "../RightSideDrawer/RightSideDrawer";

const ChatHeader = () => {
  const { User, SelectedChat } = ChatState();
  const [DrawerCategory, setDrawerCategory] = useState("");
  const [isOpenDrawer, setisOpenDrawer] = useState(false);

  const handleOpenDrawer = () => {
    setisOpenDrawer(true);
  };
  const handleCloseDrawer = () => {
    setisOpenDrawer(false);
  };
  const groupProfileHandler = () => {
    setDrawerCategory("Group");
    handleOpenDrawer();
  };
  const oneProfileHandler = () => {
    setDrawerCategory("OnetoOne");
    handleOpenDrawer();
  };
  // console.log(SelectedChat.users);
  return (
    <>
      <Flex alignItems="center">
        {SelectedChat.isGroupChat ? (
          <Flex w={"100%"} onClick={groupProfileHandler}>
            <Box p="2" mx={1}>
              <Avatar
                size={"md"}
                cursor={"pointer"}
                name={SelectedChat.chatName}
                bg={"#f0f2f5"}
                color={"black"}
              ></Avatar>
            </Box>
            <Box py={"2"}>
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
                      {user.name === User.name ? "You" : user.name}
                      {!isLastUser && ","}
                    </Text>
                  );
                })}
              </Flex>
            </Box>
          </Flex>
        ) : (
          <>
          <Box display={"flex"} alignItems="center" onClick={oneProfileHandler} w={"100%"}>
            <Box p="2" mx={1}>
              <Avatar
                size={"md"}
                cursor={"pointer"}
                name={getSenderName(User, SelectedChat?.users)}
                src={getSenderPic(User, SelectedChat?.users)}
                as={"button"}
              ></Avatar>
            </Box>
            <Text color={"white"} fontSize={"18px"} fontWeight={"semibold"}>
              {getSenderName(User, SelectedChat?.users)}
            </Text></Box>
          </>
        )}
      </Flex>
      <RightSideDrawer
        isOpenDrawer={isOpenDrawer}
        onCloseDrawer={handleCloseDrawer}
        drawerCat={DrawerCategory}
      ></RightSideDrawer>
    </>
  );
};

export default ChatHeader;
