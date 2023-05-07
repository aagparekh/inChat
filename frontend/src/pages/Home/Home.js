import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import "./Home.css";
import Login from "../../components/Auth/Login/Login";
import Signup from "../../components/Auth/Signup/Signup";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
     if(!userInfo){
        navigate("/")
     }
  }, [navigate])
  
  return (
    <div>
      <Container
        maxW="xl"
        className="Container"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        centerContent
      >
        <Box
          p={5}
          bg={"white"}
          w="100%"
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Text
            as={"center"}
            fontSize={"4xl"}
            fontWeight={"semibold"}
            className="title"
          >
            inChat
          </Text>
          <Tabs isFitted my={4} variant="soft-rounded" colorScheme="whatsapp">
            <TabList my={2}>
              <Tab fontSize={"md"} fontWeight={"medium"}>
                Log In
              </Tab>
              <Tab fontSize={"md"} fontWeight={"medium"}>
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login></Login>
              </TabPanel>
              <TabPanel>
                <Signup></Signup>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
