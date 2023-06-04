import React, { useEffect, useState } from "react";
import "./RightSideDrawer.css";
import {
  Avatar,
  Box,
  Button,
  Center,
  Circle,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
import {
  AddIcon,
  ArrowBackIcon,
  CheckIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import UserList from "../UserList/UserList";
import GroupList from "../GroupList/GroupList";
import ChatLoading from "../ChatLoading";
import UserBadge from "../UserBadge/UserBadge";

const RightSideDrawer = ({ isOpenDrawer, onCloseDrawer, drawerCat }) => {
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
  const [openModal, setopenModal] = useState(false);
  const [isFocus, setisFocus] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [SearchedUser, setSearchedUser] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [SelectedGroupMembers, setSelectedGroupMembers] = useState([]);

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
  const handleInputFocus = () => {
    setisFocus(true);
  };
  const handleInputBlur = () => {
    setisFocus(false);
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    setGroupNameCondition(false);
    setGroupName("");
    return () => {};
  }, [onCloseDrawer]);

  useEffect(() => {
    const SearchUser = async () => {
      try {
        setLoading(true);
        await fetch(`/api/user?search=${inputValue}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${User.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) =>
            // filtering the user which are already existed in the group
            setSearchedUser(
              data.filter(
                (user) =>
                  !SelectedChat?.users.find((user1) => user1._id === user._id)
              )
            )
          );

        //   if (!response.ok) {
        //     throw new Error('Failed to fetch data from API');
        //   }

        //const data = await response.json();
        setLoading(false);
      } catch (error) {
        // Handle error here
        console.error(error);
      }
    };
    if (inputValue) {
      SearchUser();
    } else {
      setSearchedUser();
    }
    return () => {};
  }, [inputValue]);
  const HandleGroup = (user) => {
    // console.log(user);
    if (
      Boolean(SelectedGroupMembers.find((member) => member._id === user._id))
    ) {
      toast({
        title: "User Already Exist",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedGroupMembers([...SelectedGroupMembers, user]);
  };
  const handleCloseFunction = (user) => {
    // console.log(user);
    setSelectedGroupMembers(
      SelectedGroupMembers.filter((mem) => mem._id !== user._id)
    );
  };
  const handleModalClose = () => {
    setopenModal(false);
    setInputValue("");
    setSelectedGroupMembers([]);
    setSearchedUser([]);
  };
  const addToGroup = async () => {
    try {
      setSpinnerLoading(true);
      const body = {
        chatId: SelectedChat._id,
        users: JSON.stringify(SelectedGroupMembers.map((user) => user._id)),
      };
      const response = await fetch("/api/chat/add-to-group", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${User.token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      // console.log(data);
      setSelectedChat(data);
      setFetch(!Fetch);
      setSpinnerLoading(false);
      toast({
        title: "Member(s) Added Successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      handleModalClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveGroupMember = async () => {
    const body = {
      chatId: SelectedChat._id,
      userId: User._id,
    };
    try {
      setSpinnerLoading(true);
      const response = await fetch("/api/chat/remove-from-group", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${User.token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setCurrentUserChat(
        CurrentUserChat.filter((chat) => chat._id !== data._id)
      );
      setSpinnerLoading(false);
      setSelectedChat();
      toast({
        title: `You left "${data.chatName}"`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {drawerCat === "Group" ? (
        <Drawer isOpen={isOpenDrawer} onClose={onCloseDrawer} placement="right">
          {/* <DrawerOverlay /> */}
          <DrawerContent maxH="91vh" maxWidth={"430px"} mx={3} mt={6}>
            <div className="drawer-header">
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
                    onClick={() => setopenModal(true)}
                    cursor={"pointer"}
                    backgroundColor={"transparent"}
                  >
                    <Avatar
                      size={"md"}
                      cursor={"pointer"}
                      bg="#00a884de"
                      icon={<AddIcon />}
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
                {SelectedChat.groupAdmin?._id === User._id ? (
                  <Flex alignItems="center" gap={5} onClick={HandleDeleteChat}>
                    <i
                      class="fa-solid fa-trash"
                      style={{ color: "red", fontSize: "18px" }}
                    ></i>
                    <Text color={"red.500"} fontSize={"lg"}>
                      Delete group
                    </Text>
                  </Flex>
                ) : (
                  <Flex
                    alignItems="center"
                    gap={5}
                    onClick={handleRemoveGroupMember}
                  >
                    <i
                      class="fa-solid fa-arrow-right-from-bracket"
                      style={{ color: "red", fontSize: "18px" }}
                    ></i>
                    <Text color={"red.500"} fontSize={"lg"}>
                      Exit group
                    </Text>
                  </Flex>
                )}
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
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Drawer isOpen={isOpenDrawer} onClose={onCloseDrawer} placement="right">
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

      <Modal isOpen={openModal} onClose={handleModalClose} isCentered>
        <ModalOverlay />
        <ModalContent h={"75vh"} w={"430px"}>
          <div className="drawer-header">
            <ModalHeader color={"white"}>Add Participants</ModalHeader>
            <ModalCloseButton color={"white"} />
          </div>
          <ModalBody p={0}>
            <Box borderBottom="2px" borderBottomColor="gray.200" px={4} py={2}>
              <InputGroup onFocus={handleInputFocus} onBlur={handleInputBlur}>
                <InputLeftElement>
                  {isFocus || inputValue ? (
                    <ArrowBackIcon
                      fontSize={"xl"}
                      cursor={"pointer"}
                      color={"green"}
                      fontWeight={"black"}
                      mt={4}
                      // onClick={handleSearch}
                    ></ArrowBackIcon>
                  ) : (
                    <Search2Icon
                      fontSize={"md"}
                      cursor={"pointer"}
                      color={"grey"}
                      mt={4}
                    ></Search2Icon>
                  )}
                </InputLeftElement>
                <Input
                  placeholder="Type name..."
                  my={2}
                  onChange={handleInputChange}
                  backgroundColor={"#f0f2f5"}
                ></Input>
              </InputGroup>
            </Box>
            {SelectedGroupMembers.length > 0 ? (
              <Box
                borderBottom="2px"
                borderBottomColor="gray.200"
                h={"15%"}
                pb={2}
                overflowY={"scroll"}
                m={2}
                display={"flex"}
                flexWrap={"wrap"}
              >
                {SelectedGroupMembers.map((user) => (
                  <UserBadge
                    key={user._id}
                    user={user}
                    HandleClick={() => handleCloseFunction(user)}
                  />
                ))}
              </Box>
            ) : null}
            <Box
              h={SelectedGroupMembers.length > 0 ? "33%" : "48%"}
              overflowY={"scroll"}
            >
              {Loading ? (
                <ChatLoading />
              ) : SearchedUser?.length > 0 ? (
                SearchedUser.map((userChat) => (
                  <UserList
                    key={userChat._id}
                    chat={userChat}
                    handleClick={() => HandleGroup(userChat)}
                  />
                ))
              ) : inputValue === "" ? (
                <Center h="100%" color="blackAlpha.600">
                  Search name to add participants...
                </Center>
              ) : (
                <Center h="100%" color="blackAlpha.600">
                  No results found for '{inputValue}'
                </Center>
              )}
            </Box>
            <Center
              w={"100%"}
              h={SelectedGroupMembers.length > 0 ? "16%" : "36%"}
              backgroundColor={"#f0f2f5"}
            >
              {SelectedGroupMembers.length > 0 ? (
                SpinnerLoading ? (
                  <Center>
                    <Spinner
                      thickness="3px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="whatsapp.500"
                      size="lg"
                    />
                  </Center>
                ) : (
                  <Circle
                    size="50px"
                    bg="#00a884de"
                    color="white"
                    onClick={addToGroup}
                  >
                    <CheckIcon boxSize={5} cursor={"pointer"} />
                  </Circle>
                )
              ) : null}
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RightSideDrawer;
