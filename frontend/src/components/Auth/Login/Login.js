import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setshow] = useState(false);
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loading, setloading] = useState(false);
  const handleClick = () => setshow(!show);
  const toast = useToast();
  const navigate = useNavigate();
  let userData;

  const SubmitHandler = async () => {
    setloading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Required Fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setloading(false);
      return;
    }
    try {
      const data = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          console.log(response);
          if (response.status === 401) {
            throw new Error("Invalid Email Or Password"); // Throw error if response is not successful (status code other than 2xx)
          }
          return response.json(); // Parse response as JSON
        })
        .then((data) => {
          userData = data;
        });
      toast({
        title: "Login is Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(userData));
      setloading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: 'Invalid Credentials',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setloading(false);
    }
  };
  return (
    <VStack spacing={3}>
      {/* Email */}
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Email"
          onChange={(e) => setemail(e.target.value)}
          value={ email }
        ></Input>
      </FormControl>

      {/* Password */}
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Password"
            onChange={(e) => setpassword(e.target.value)}
            type={show ? "text" : "password"}
            mb={2}
            value={password}
          ></Input>
          <InputRightElement onClick={handleClick} cursor={"pointer"}>
            {show ? <ViewOffIcon /> : <ViewIcon />}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="whatsapp"
        variant="solid"
        size="md"
        width={"100%"}
        onClick={SubmitHandler}
        isLoading={loading}
      >
        Log In
      </Button>
      <Button
        colorScheme="whatsapp"
        variant="outline"
        size="md"
        width={"100%"}
        onClick={() => {
          setemail("guest@user.com");
          setpassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
