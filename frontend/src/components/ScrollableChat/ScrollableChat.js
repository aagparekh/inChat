import { Avatar, Flex, Text, Tooltip, textDecoration } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  firstMessage,
  myChat,
} from "../../config/ChatSender";
// import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = ({ messages }) => {
  const { User, SelectedChat } = ChatState();
  // const [myDate, setmyDate] = useState("");
  let myDate = "";
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };
  return (
    <>
      {messages &&
        messages.map((m, index) => {
          const createdAt = new Date(m.createdAt);
          const hours = createdAt.getHours();
          const minutes = createdAt.getMinutes();
          const month = createdAt.getMonth();
          const year = createdAt.getFullYear();
          const day = createdAt.getDate();
          const formattedHours = String(hours).padStart(2, "0");
          const formattedMinutes = String(minutes).padStart(2, "0");
          let date = day + "/" + month + "/" + year;
          const time = formattedHours + ":" + formattedMinutes;

          return (
            <>
              {myDate !== date ? (
                <Flex justifyContent={"center"}>
                  <Text
                    maxWidth={"75%"}
                    bgColor={"#FFFFFFF2"}
                    borderRadius={"7.5px"}
                    boxShadow={"0 1px 0.5px rgba(11,20,26,.13);"}
                    px={"12px"}
                    py={"6px"}
                    my={5}
                    color={"#54656f"}
                    fontSize={"12.5px"}
                  >
                    {(myDate = date)}
                  </Text>
                </Flex>
              ) : null}

              <Flex
                key={m._id}
                width={"100%"}
                justifyContent={myChat(m, User._id) ? "flex-end" : "flex-start"}
              >
                {(firstMessage(messages,m,index,User._id,day)) &&
                  SelectedChat.isGroupChat && (
                    <Tooltip
                      label={`${m.sender.name}'s Profile`}
                      hasArrow
                      placement="bottom"
                    >
                      <Avatar
                        size={"sm"}
                        name={m.sender.name}
                        src={m.sender.pic}
                      ></Avatar>
                    </Tooltip>
                  )}

                <Text
                  maxWidth={"75%"}
                  bgColor={myChat(m, User._id) ? "#d9fdd3" : "white"}
                  borderRadius={"7.5px"}
                  boxShadow={"0 1px 0.5px rgba(11,20,26,.13);"}
                  pl={"9px"}
                  pr={"11px"}
                  pb={"8px"}
                  pt={"6px"}
                  mb={"4px"}
                  ml={
                    firstMessage(messages,m,index,User._id,day) &&
                    SelectedChat.isGroupChat
                      ? 3
                      : "43px"
                  }
                >
                  {(firstMessage(messages,m,index,User._id,day)) &&
                    SelectedChat.isGroupChat && (
                      <Text
                        fontWeight={"semibold"}
                        fontSize={"13.8px"}
                        cursor={"pointer"}
                        _hover={{ textDecoration: "underline" }}
                        color={generateRandomColor()}
                      >
                       ~ {m.sender.name !== User.name ? m.sender.name : null}
                      </Text>
                    )}
                  {m.content}
                  <Text as="sub" ml={2} color={"#667781"} fontSize={"11px"}>
                    {time}
                  </Text>
                </Text>
              </Flex>
            </>
          );
        })}
    </>
  );
};

export default ScrollableChat;
