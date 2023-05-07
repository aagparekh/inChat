import React, { useState,useEffect} from "react";
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
} from "@chakra-ui/react";
import "./SideDrawer.css";
import { ArrowBackIcon, Search2Icon } from "@chakra-ui/icons";
const SideDrawer = ({ isOpen, onClose, drawerCat }) => {
  // const {onClose } = useDisclosure()
  const [isFocus, setisFocus] = useState(false);
  // const inputRef = useRef();
  const [inputValue, setInputValue] = useState();
  const [Loading, setLoading] = useState(false)


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    
  };

  const handleInputFocus = () => {
    setisFocus(true);
  };
  const handleInputBlur = () => {
    setisFocus(false);
  };
  const handleSearch = () =>{
    console.log("hello");
  }
//   useEffect(() => {
//     first
  
//     return () => {
//       second
//     }
//   }, [third])
  
  
  return (
    <>
      {drawerCat ?
      // profile
      (
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
      ) 
      // profile
      
      : 
      
      // Search Users
      (
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          {/* <DrawerOverlay /> */}
          <DrawerContent maxH="91vh" maxWidth={"430px"} ml={3} mt={5}>
            <div id="drawer-header">
              <DrawerCloseButton color={"white"} fontWeight={"black"} />
              <DrawerHeader color={"white"}>Search Users</DrawerHeader>
            </div>
            <DrawerBody p={0}>
              <Box borderBottom='2px' borderBottomColor='gray.200' p={2}>
                <InputGroup
                onFocus={handleInputFocus}
                onBlur = {handleInputBlur}
              
                >
                  <InputLeftElement
                  
                  >
                    {
                      isFocus || inputValue? 
                      <ArrowBackIcon
                      fontSize={"xl"}
                        cursor={"pointer"}
                        color={"green"}
                        fontWeight={"black"}
                        mt={4}
                        onClick={handleSearch}
                      >

                      </ArrowBackIcon>
                      :

                      <Search2Icon
                        fontSize={"md"}
                        cursor={"pointer"}
                        color={"grey"}
                        mt={4}
                      ></Search2Icon>
                    }
                  </InputLeftElement>
                  <Input
                    placeholder="Search Users.."
                    my={2}
                    onChange={handleInputChange}
                    backgroundColor={"#eae6df"}
                  ></Input>
                  
                </InputGroup>
              </Box>
              <Box className="searchChats" h={"87%"} w={"100%"}>

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
