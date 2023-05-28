import { Avatar, Flex, Text, Tooltip } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { isLastMessage, isSameSender, myChat } from "../../config/ChatSender";
// import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = ({ messages}) => {
  const { User, SelectedChat } = ChatState();  
  return (
    <>
      {messages &&
        messages.map((m, index) => {
          const createdAt = new Date(m.createdAt);
          const hours = createdAt.getHours();
          const minutes = createdAt.getMinutes();

          const formattedHours = String(hours).padStart(2, "0");
          const formattedMinutes = String(minutes).padStart(2, "0");

          const time = formattedHours + ":" + formattedMinutes;
          return (
            <Flex
              key={m._id}
              width={"100%"}
              justifyContent={myChat(m, User._id) ? "flex-end" : "flex-start"}
            >
              {(isSameSender(messages, m, index, User._id) ||
                isLastMessage(messages, index, User._id)) &&
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
                pr={"7px"}
                pb={"8px"}
                pt={"6px"}
                mb={"4px"}
              >
                {m.content}
                <Text as="sub" ml={2} color={"#667781"} fontSize={"11px"}>
                  {time}
                </Text>
              </Text>
            </Flex>
          );
        })}
    </>
  );
};

export default ScrollableChat;
