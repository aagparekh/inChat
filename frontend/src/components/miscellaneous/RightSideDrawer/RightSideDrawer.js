import React, { useEffect, useState } from "react";
import "./RightSideDrawer.css";
import {
  Avatar,
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  HStack,
  IconButton,
  Input,
  Spacer,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../../context/ChatProvider";
import {
  getSenderEmail,
  getSenderName,
  getSenderPic,
} from "../../../config/ChatSender";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
// import UserList from "../UserList/UserList";
import GroupList from "../GroupList/GroupList";

const RightSideDrawer = ({ isOpen, onClose, drawerCat }) => {
  const {
    User,
    SelectedChat,
    setSelectedChat,
    CurrentUserChat,
    setCurrentUserChat,
    Fetch,
    setFetch,
  } = ChatState();
  const [SpinnerLoading, setSpinnerLoading] = useState(false);
  const toast = useToast();
  const [GroupNameCondition, setGroupNameCondition] = useState(false);
  const [GroupName, setGroupName] = useState("");
  // setGroupName(SelectedChat.chatName)

  const HandleDeleteChat = async () => {
    const chatId = SelectedChat._id;
    // console.log(JSON.stringify({ chatId }));
    setSpinnerLoading(true);
    const response = await fetch("/api/chat", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${User.token}`,
      },
      body: JSON.stringify({ chatId }),
    });
    const data = await response.json();
    setTimeout(() => {
      setSpinnerLoading(false);
    }, 4000);
    setCurrentUserChat(CurrentUserChat.filter((chat) => chat._id !== data._id));
    setSelectedChat();
    toast({
      title: "Chat Deleted",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top",
    });
  };
  const HandeleEditGroupName = async () => {
    setGroupName(SelectedChat.chatName);
    setGroupNameCondition(true);
  };
  const HandleSaveGroupName = async () => {
    const chatId = SelectedChat._id;
    const chatName = GroupName;
    // console.log(JSON.stringify({ chatId,groupname }));
    try {
      const response = await fetch("/api/chat/rename", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${User.token}`,
        },
        body: JSON.stringify({ chatId, chatName }),
      });
      const data = await response.json();
      // console.log(data);
      setSelectedChat(data);
      setGroupNameCondition(false);
      setGroupName("");
      setFetch(!Fetch);
      toast({
        title: "Group name updated",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setGroupNameCondition(false);
    setGroupName("");
    return () => {};
  }, [onClose]);

  return (
    <>
      {drawerCat === "Group" ? (
        <Drawer isOpen={isOpen} onClose={onClose} placement="right">
          {/* <DrawerOverlay /> */}
          <DrawerContent maxH="91vh" maxWidth={"430px"} mx={3} mt={6}>
            <div id="drawer-header">
              <DrawerCloseButton color={"white"} />
              <DrawerHeader color={"white"}>Group info</DrawerHeader>
            </div>

            <DrawerBody p={0} overflowY={"scroll"}>
              {/* group profile */}
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                p={3}
                w={"100%"}
                h={"350px"}
                borderBottom="12px solid #f0f2f5"
                flexDirection={"column"}
              >
                <Box>
                  <Avatar
                    width="250px"
                    height="250px"
                    name={SelectedChat.chatName}
                    mb={2}
                    size={"2xl"}
                  ></Avatar>
                </Box>
                <Box>
                  <Flex justifyContent={"center"} alignItems={"center"}>
                    {GroupNameCondition ? (
                      <Input
                        p={0}
                        fontSize={"21px"}
                        value={GroupName}
                        border={"none"}
                        borderBottom={"2px"}
                        borderRadius={"none"}
                        borderBottomColor={"#00a884de"}
                        _hover={"none"}
                        id="groupname"
                        mr={6}
                        onChange={(e) => {
                          setGroupName(e.target.value);
                        }}
                      ></Input>
                    ) : (
                      <Text textAlign={"center"} fontSize={"21px"} mr={3}>
                        {SelectedChat.chatName}
                      </Text>
                    )}
                    {GroupName === "" ? (
                      <i
                        class="fa-solid fa-pencil"
                        onClick={HandeleEditGroupName}
                        style={{ color: "#00a884de", cursor: "pointer" }}
                      ></i>
                    ) : (
                      <i
                        class="fa-solid fa-check"
                        onClick={HandleSaveGroupName}
                        style={{ color: "#00a884de", cursor: "pointer" }}
                      ></i>
                    )}
                  </Flex>
                  <Text
                    textAlign={"center"}
                    fontSize={"18px"}
                    color={"#8696a0"}
                  >
                    group ~ {SelectedChat.users.length} participants
                  </Text>
                </Box>
              </Flex>

              {/* Group Description */}
              <Box px={7} py={4} borderBottom="12px solid #f0f2f5">
                <Text mb={2} color={"whatsapp.500"}>
                  Group Description
                </Text>
                <Text>Hey there! I am using inChat.</Text>
              </Box>

              {/* Group members list */}
              <Box px={7} py={4} borderBottom="12px solid #f0f2f5">
                <Text mb={1} fontSize={"16px"} color={"#8696a0"}>
                  {SelectedChat.users.length} participants
                </Text>
                {SelectedChat.groupAdmin?._id === User._id ? (
                  <HStack
                    px={4}
                    py={2}
                    _hover={{ backgroundColor: "#f0f2f5" }}
                    // onClick={handleClick}
                    cursor={"pointer"}
                    backgroundColor={"transparent"}
                  >
                    <Avatar
                      size={"md"}
                      cursor={"pointer"}
                      bg="#00a884de"
                      icon={<AddIcon/>}
                    ></Avatar>
                    <Box p={2} w={"100%"}>
                      <Text fontSize={"lg"}>Add Participants</Text>
                    </Box>
                  </HStack>
                ) : null}
                {SelectedChat.users.map((user) => {
                  return <GroupList key={user._id} chat={user} />;
                })}
              </Box>

              {/* exit group */}
              <Box
                px={7}
                py={4}
                cursor={"pointer"}
                _hover={{ backgroundColor: "#ebedf096" }}
              >
                <Flex alignItems="center" gap={5}>
                  <i
                    class="fa-solid fa-arrow-right-from-bracket"
                    style={{ color: "red", fontSize: "18px" }}
                  ></i>
                  <Text color={"red.500"} fontSize={"lg"}>
                    Exit group
                  </Text>
                </Flex>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Drawer isOpen={isOpen} onClose={onClose} placement="right">
          {/* <DrawerOverlay /> */}
          <DrawerContent maxH="91vh" maxWidth={"430px"} mx={3} mt={6}>
            <div id="drawer-header">
              <DrawerCloseButton color={"white"} />
              <DrawerHeader color={"white"}>Profile</DrawerHeader>
            </div>

            <DrawerBody p={0}>
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                p={3}
                w={"100%"}
                h={"350px"}
                borderBottom="12px solid #f0f2f5"
              >
                <Box>
                  <Avatar
                    width="250px"
                    height="250px"
                    name={getSenderName(User, SelectedChat?.users)}
                    src={getSenderPic(User, SelectedChat?.users)}
                    mb={2}
                  ></Avatar>
                  <Text textAlign={"center"} fontSize={"21px"}>
                    {getSenderName(User, SelectedChat?.users)}
                  </Text>
                  <Text
                    textAlign={"center"}
                    fontSize={"18px"}
                    color={"#8696a0"}
                  >
                    ~{getSenderEmail(User, SelectedChat?.users)}
                  </Text>
                </Box>
              </Flex>
              <Box px={7} py={4} borderBottom="12px solid #f0f2f5">
                <Text mb={2} color={"whatsapp.500"}>
                  About
                </Text>
                <Text>Hey there! I am using inChat.</Text>
              </Box>

              <Box
                px={7}
                py={4}
                cursor={"pointer"}
                onClick={HandleDeleteChat}
                _hover={{ backgroundColor: "#ebedf096" }}
              >
                <Flex alignItems="center" gap={5}>
                  <i
                    class="fa-solid fa-trash"
                    style={{ color: "red", fontSize: "18px" }}
                  ></i>
                  {/* <DeleteIcon boxSize={5} color="red.500" /> */}
                  <Text color={"red.500"} fontSize={"lg"}>
                    Delete Chat
                  </Text>
                </Flex>
              </Box>

              {SpinnerLoading ? (
                <Center>
                  <Spinner
                    thickness="3px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="whatsapp.500"
                    size="lg"
                  />
                </Center>
              ) : null}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default RightSideDrawer;
