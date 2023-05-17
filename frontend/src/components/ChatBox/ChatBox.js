import React from "react";
import "./ChatBox.css";
import { ChatState } from "../../context/ChatProvider";
import { getSenderName } from "../../config/ChatSender";
import { Box, Center, Flex, Square, Text } from "@chakra-ui/react";
// import { ChatIcon } from "@chakra-ui/icons";
import SingleChat from "../miscellaneous/SingleChat/SingleChat";
const ChatBox = () => {
  const {SelectedChat} = ChatState();
  // console.log(SelectedChat?.users);
  // console.log(SelectedChat);
  return (
    <>
      {SelectedChat ? (
        <SingleChat></SingleChat>
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
