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
} from "@chakra-ui/react";
import "./SideDrawer.css";
import { ArrowBackIcon, Search2Icon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import { ChatState } from "../../../context/ChatProvider";
import UserList from "../UserList/UserList";
const SideDrawer = ({ isOpen, onClose, drawerCat }) => {
  // const {onClose } = useDisclosure()
  const [isFocus, setisFocus] = useState(false);
  // const inputRef = useRef();
  const [inputValue, setInputValue] = useState();
  const [Loading, setLoading] = useState(false);
  const [CurrentUserChat, setCurrentUserChat] = useState([]);
  const [SearchedUser, setSearchedUser] = useState([]);
  const { User } = ChatState();

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
  }, [User.token]);

  useEffect(() => {
    const SearchUser = async () => {
      try {
        setLoading(true);
        await fetch(`/api/user?search=${inputValue}`, {
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

  const accessChat = (userId) => {};

  return (
    <>
      {
        drawerCat ? (
          // profile
          <Drawer isOpen={isOpen} onClose={onClose} placement="left">
            {/* <DrawerOverlay /> */}
            <DrawerContent maxH="91vh" maxWidth={"430px"} mx={3} mt={5}>
              <div id="drawer-header">
                <DrawerCloseButton color={"white"} />
                <DrawerHeader color={"white"}>Profile</DrawerHeader>
              </div>

              <DrawerBody></DrawerBody>
            </DrawerContent>
          </Drawer>
        ) : (
          // profile

          // Search Users
          <Drawer isOpen={isOpen} onClose={onClose} placement="left">
            {/* <DrawerOverlay /> */}
            <DrawerContent maxH="91vh" maxWidth={"430px"} ml={3} mt={5}>
              <div id="drawer-header">
                <DrawerCloseButton color={"white"} fontWeight={"black"} />
                <DrawerHeader color={"white"}>Search Users</DrawerHeader>
              </div>
              <DrawerBody p={0}>
                <Box borderBottom="2px" borderBottomColor="gray.200" p={2}>
                  <InputGroup
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  >
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
                <Box className="searchChats" h={"87%"} w={"100%"} mt={3}>
                  {Loading ? (
                    <ChatLoading />
                  ) : SearchedUser ? (
                    SearchedUser.length > 0 ? (
                      SearchedUser?.map((userChat) => {
                        return (
                          <UserList
                            key={userChat._id}
                            chat={userChat}
                            openChat={() => accessChat(userChat._id)}
                          />
                        );
                      })
                    ) : (
                      <Center color={"blackAlpha.600"}>
                        No results found for '{inputValue}'
                      </Center>
                    )
                  ) : // console.log(CurrentUserChat))
                  CurrentUserChat.length === 0 ? (
                    <Center color={"blackAlpha.600"}>
                      Create or make new chats...
                    </Center>
                  ) : (
                    CurrentUserChat?.map((chat) => {
                      // add this line to print the user object
                      return (
                        <UserList
                          key={chat._id}
                          chat={chat}
                          openChat={() => accessChat(chat._id)}
                        />
                      );
                    })
                  )}
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )
        // Search Users
      }
    </>
  );
};

export default SideDrawer;
