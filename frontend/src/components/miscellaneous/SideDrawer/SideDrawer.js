import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  InputGroup,
  Input,
  InputLeftElement,
  Box,
  Text,
  Center,
  Avatar,
  useToast,
  Button,
  Circle,
} from "@chakra-ui/react";
import "./SideDrawer.css";
import { ArrowBackIcon, CheckIcon, Search2Icon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import { ChatState } from "../../../context/ChatProvider";
import UserList from "../UserList/UserList";
import { getSender, getSenderId } from "../../../config/ChatSender";
import UserBadge from "../UserBadge/UserBadge";

const SideDrawer = ({ isOpen, onClose, drawerCat }) => {
  // const {onClose } = useDisclosure()
  const [isFocus, setisFocus] = useState(false);
  // const inputRef = useRef();
  const [inputValue, setInputValue] = useState();
  const [Loading, setLoading] = useState(false);
  const [SearchedUser, setSearchedUser] = useState([]);
  const [SelectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const {
    User,
    CurrentUserChat,
    setCurrentUserChat,
    setSelectedChat,
    FetchAllUsers,
    SelectedChat,
    setFetchAllUsers,
    setFetch,
    Fetch,
  } = ChatState();
  const [FetchAgain, setFetchAgain] = useState(false);
  const [SearchFiltered, setSearchFiltered] = useState([]);
  const [GroupChatName, setGroupChatName] = useState("");
  const filteredUsers = FetchAllUsers?.filter(
    (user) => !SelectedGroupMembers?.includes(user)
  );

  const toast = useToast();
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputFocus = () => {
    setisFocus(true);
  };
  const handleInputBlur = () => {
    setisFocus(false);
  };
  const handleSearch = () => {
    console.log("hello in handle search");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/chat", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${User.token}`,
          },
        });

        // if (!response.ok && response.) {
        //   throw new Error('Failed to fetch data from API');
        // }

        const data = await response.json();
        console.log(data);
        setLoading(false);
        setCurrentUserChat(data);
      } catch (error) {
        // Handle error here
        console.error(error);
      }
    };
    fetchUser();
    // Cleanup function
    return () => {
      // Cancel any ongoing requests here
    };
  }, [FetchAgain]);

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
          .then((data) => setSearchedUser(data));
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

  useEffect(() => {
    const filteredUsers = SearchedUser?.filter(
      (user) => !SelectedGroupMembers?.includes(user)
    );
    setSearchFiltered(filteredUsers);
  }, [SearchedUser, SelectedGroupMembers]);

  const accessChat = async (userId) => {
    // console.log(userId);

    try {
      const jsonUserId = JSON.stringify({ userId });
      // console.log(jsonUserId);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${User.token}`,
        },
        body: jsonUserId,
      });
      const data = await response.json();
      setSelectedChat(data);
      console.log(data);
      // if(!CurrentUserChat.find((c)=>c._id == data._id))
      // {
      //   setCurrentUserChat([data,...CurrentUserChat]);
      // }
      setFetchAgain(!FetchAgain);
      setSearchedUser();
      setInputValue();
      onClose();
      if (CurrentUserChat.find((chat) => chat._id === data._id)) {
        toast({
          description: "Enjoy Chatting!!",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Chat created.",
          description: "Enjoy Chatting!!",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  const createGroup = async () => {
    if (GroupChatName == "" || SelectedGroupMembers.length == 0) {
      toast({
        description: "Please Fill All The Fields",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const body = {
        name: GroupChatName,
        users: JSON.stringify(SelectedGroupMembers.map((user) => user._id)),
      };
      const response = await fetch("/api/chat/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${User.token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      // console.log(data);
      toast({
        title: "Group Created",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setSelectedGroupMembers([]);
      onClose();
      setFetch(!Fetch);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {drawerCat === "Profile" ? (
        // profile
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          {/* <DrawerOverlay /> */}
          <DrawerContent maxH="91vh" maxWidth={"430px"} mx={3} mt={6}>
            <div id="drawer-header">
              <DrawerCloseButton color={"white"} />
              <DrawerHeader color={"white"}>Profile</DrawerHeader>
            </div>

            <DrawerBody p={0}>
              <Center p={3} w={"100%"} h={"250px"} backgroundColor={"#f0f2f5"}>
                <Avatar
                  width="180px"
                  height="180px"
                  name={User.name}
                  src={User.pic}
                ></Avatar>
              </Center>
              <Box
                px={7}
                py={4}
                borderBottom={"2px"}
                borderBottomColor={"blackAlpha.300"}
              >
                <Text mb={4} color={"whatsapp.500"}>
                  Your name
                </Text>
                <Text>{User.name}</Text>
              </Box>
              <Box
                px={7}
                py={4}
                borderBottom={"2px"}
                borderBottomColor={"blackAlpha.300"}
              >
                <Text mb={4} color={"whatsapp.500"}>
                  Your email address
                </Text>
                <Text>{User.email}</Text>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : drawerCat === "Search" ? (
        // Search Users
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          {/* <DrawerOverlay /> */}
          <DrawerContent maxH="91vh" maxWidth={"430px"} ml={3} mt={6}>
            <div id="drawer-header">
              <DrawerCloseButton color={"white"} fontWeight={"black"} />
              <DrawerHeader color={"white"}>Search Users</DrawerHeader>
            </div>
            <DrawerBody p={0}>
              <Box borderBottom="2px" borderBottomColor="gray.200" p={2}>
                <InputGroup onFocus={handleInputFocus} onBlur={handleInputBlur}>
                  <InputLeftElement>
                    {isFocus || inputValue ? (
                      <ArrowBackIcon
                        fontSize={"xl"}
                        cursor={"pointer"}
                        color={"green"}
                        fontWeight={"black"}
                        mt={4}
                        onClick={handleSearch}
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
                    placeholder="Search Users.."
                    my={2}
                    onChange={handleInputChange}
                    backgroundColor={"#f0f2f5"}
                  ></Input>
                </InputGroup>
              </Box>
              <Box className="searchChats" h={"87%"} w={"100%"}>
                {Loading ? (
                  <ChatLoading />
                ) : SearchedUser ? (
                  SearchedUser.length > 0 ? (
                    SearchedUser?.map((userChat) => {
                      return (
                        <UserList
                          key={userChat._id}
                          chat={userChat}
                          handleClick={() => {
                            accessChat(userChat._id);
                          }}
                        />
                      );
                    })
                  ) : (
                    <Center h={"100%"} color={"blackAlpha.600"}>
                      No results found for '{inputValue}'
                    </Center>
                  )
                ) : // console.log(CurrentUserChat))
                CurrentUserChat.length === 0 ? (
                  <Center h={"100%"} color={"blackAlpha.600"}>
                    Create or make new chats...
                  </Center>
                ) : (
                  CurrentUserChat?.filter((chat) => !chat.isGroupChat).map(
                    (chat) => {
                      // add this line to print the user object
                      return (
                        <UserList
                          key={chat._id}
                          chat={chat}
                          handleClick={() =>
                            accessChat(getSenderId(User, chat.users))
                          }
                        />
                      );
                    }
                  )
                )}
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          {/* <DrawerOverlay /> */}
          <DrawerContent maxH="91vh" maxWidth={"430px"} mx={3} mt={6}>
            <div id="drawer-header">
              <DrawerCloseButton color={"white"} />
              <DrawerHeader color={"white"}>New Group</DrawerHeader>
            </div>

            <DrawerBody overflowX={"hidden"} p={0}>
              <Box
                borderBottom="2px"
                borderBottomColor="gray.200"
                px={4}
                py={2}
              >
                <Input
                  placeholder="Add a group name"
                  my={2}
                  p={1}
                  border={"none"}
                  borderBottom={"2px"}
                  borderRadius={"none"}
                  borderBottomColor={"#00a884de"}
                  _hover={"none"}
                  id="groupname"
                  onChange={(e) => setGroupChatName(e.target.value)}
                ></Input>
                <InputGroup onFocus={handleInputFocus} onBlur={handleInputBlur}>
                  <InputLeftElement>
                    {isFocus || inputValue ? (
                      <ArrowBackIcon
                        fontSize={"xl"}
                        cursor={"pointer"}
                        color={"green"}
                        fontWeight={"black"}
                        mt={4}
                        onClick={handleSearch}
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
                  w={"100%"}
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
                pb={2}
                borderBottom="2px"
                borderBottomColor="gray.200"
                className="searchChats"
                h={SelectedGroupMembers.length > 0 ? "47%" : "55%"}
                w={"100%"}
              >
                {Loading ? (
                  <ChatLoading />
                ) : SearchedUser ? (
                  SearchFiltered ? (
                    SearchFiltered.map((userChat) => (
                      <UserList
                        key={userChat._id}
                        chat={userChat}
                        handleClick={() => HandleGroup(userChat)}
                      />
                    ))
                  ) : (
                    <Center h="100%" color="blackAlpha.600">
                      No results found for '{inputValue}'
                    </Center>
                  ) // console.log(CurrentUserChat))
                ) : (
                  filteredUsers &&
                  filteredUsers.map((user) => {
                    // add this line to print the user object
                    return (
                      <UserList
                        key={user._id}
                        chat={user}
                        handleClick={() => HandleGroup(user)}
                      />
                    );
                  })
                )}
              </Box>
              <Center
                w={"100%"}
                h={SelectedGroupMembers.length > 0 ? "14%" : "32%"}
                backgroundColor={"#f0f2f5"}
              >
                {SelectedGroupMembers.length > 0 ? (
                  <Circle
                    size="50px"
                    bg="#00a884de"
                    color="white"
                    onClick={createGroup}
                  >
                    <CheckIcon boxSize={5} cursor={"pointer"} />
                  </Circle>
                ) : null}
              </Center>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default SideDrawer;
