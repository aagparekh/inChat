import React, { useEffect, useState } from "react";
import "./MyChat.css";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Square,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import SideDrawer from "../miscellaneous/SideDrawer/SideDrawer";
import { ChatState } from "../../context/ChatProvider";
import { BellIcon, Search2Icon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../miscellaneous/ChatLoading";
import UserList from "../miscellaneous/UserList/UserList"


const MyChat = () => {
  const [isOpenDrawer, setisOpenDrawer] = useState(false);
  const [DrawerCategory, setDrawerCategory] = useState(false);
  const { User,CurrentUserChat, setCurrentUserChat,SelectedChat,setSelectedChat,FetchAgain, setFetchAgain} = ChatState();
  const [Loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const toast = useToast();
  
  const handleOpenDrawer = (event) => {
    const myButton = event.target.getAttribute("name");
    console.log(event.target.getAttribute("name"));
    myButton === "SearchButton"
      ? setDrawerCategory(false)
      : setDrawerCategory(true);
    setisOpenDrawer(true);
  };
  const handleCloseDrawer = () => {
    setisOpenDrawer(false);
  };

  const logoutHandler = ()=>{
    localStorage.removeItem("userInfo");
    navigate("/");
    toast({
      title: "Logout Successfull",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  }
  const accessChat = (chat)=>{
    setSelectedChat(chat)
  }
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/chat", {
          method: 'GET',
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
    // console.log(SelectedChat);

    // Cleanup function
    return () => {
      // Cancel any ongoing requests here
    };
    
  }, [isOpenDrawer])
  
  return (
    <>
      <Flex
        id="MyChat-header"
        minWidth="max-content"
        alignItems="center"
        gap="2"
      >
        <Box p="4">
          <Tooltip label={`${User.name}'s Profile`} hasArrow placement="bottom">
            <Avatar
              size={"md"}
              cursor={"pointer"}
              name={User.name}
              src={User.pic}
              as={"button"}
              onClick={handleOpenDrawer}
            ></Avatar>
          </Tooltip>
        </Box>
        <Spacer />
        <ButtonGroup gap="5" p={4}>
          <Tooltip label="Search Users" hasArrow placement="bottom">
            <Search2Icon
              fontSize={"xl"}
              my={2}
              color={"white"}
              onClick={handleOpenDrawer}
              name={"SearchButton"}
              cursor={"pointer"}
            ></Search2Icon>
          </Tooltip>
          <Tooltip label="Create New Group" hasArrow placement="bottom">
            <Square cursor={"pointer"}>
              <i class="fa-solid fa-user-group" style={{ color: "white" }}></i>
            </Square>
          </Tooltip>

          <Menu>
            <Tooltip label="Notification" hasArrow placement="bottom">
              <MenuButton>
                <BellIcon fontSize={"2xl"} color={"white"} />
              </MenuButton>
            </Tooltip>
          </Menu>

          <Menu>
            <MenuButton fontSize={"md"} color={"white"}>
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logoutHandler}>Log out</MenuItem>
              <MenuItem>My Profile</MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
        <SideDrawer
          isOpen={isOpenDrawer}
          onClose={handleCloseDrawer}
          drawerCat={DrawerCategory}
        ></SideDrawer>
      </Flex>
      <Box pt={1}>
                  {
                  Loading == true ? (
                    <ChatLoading />
                  ) :   // console.log(CurrentUserChat))
                  (CurrentUserChat.length === 0 ? (
                    <Center h={"100%"} color={"blackAlpha.600"}>
                      Create or make new chats...
                    </Center>
                  ) : 
                  (CurrentUserChat?.map((chat) => {
                    return (
                      <UserList
                        key={chat._id}
                        chat={chat}
                        openChat={() => accessChat(chat)}
                      />
                    );
                  }))
                  )}
                </Box>
    </>
  );
};

export default MyChat;
