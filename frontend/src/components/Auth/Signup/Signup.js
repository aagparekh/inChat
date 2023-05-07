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

const Signup = () => {
  const [show, setshow] = useState(false);
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [confirmpassword, setconfirmpassword] = useState();
  const [pic, setpic] = useState();
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => setshow(!show);

  const postDetails = (pics) => {
    setloading(true);
    // if(pics === undefined){
    //   toast({
    //     title: 'Please Upload an Image',
    //     status: 'warning',
    //     duration: 5000,
    //     isClosable: true,
    //   })
    // }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "inChat");
      data.append("cloud_name", "dtmxrujf6");
      
      fetch("https://api.cloudinary.com/v1_1/dtmxrujf6/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    }else{
      toast({
            title: 'Please Upload an Image',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "top",
          })
          setloading(false);

          return;
    }
  };

  const SubmitHandler = async() => {
    setloading(true);
    if(!name || !email || !password || !confirmpassword){
      toast({
        title: 'Please Fill all the Required Fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      setloading(false);
      return;
    }
    if(password !== confirmpassword){
      toast({
        title: 'Password Not Matched',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      setloading(false);
      return;
    }

    try {
      const data = await fetch("/api/user",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({name,email,password,pic})
      });
      console.log(data);
      if(data.status === 409)
      {
        throw new Error("Email Already Exists");
      }
      if(data.status === 400)
      {
        throw new Error("Enter Valid User Fields");
      }
      
      const userdata = await data.json();
      toast({
        title: 'Registration is Successfull',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo",JSON.stringify(userdata));
      setloading(false);
      navigate('/chats')
    } catch (error) {
      toast({
        title: 'Failed to Register The User',
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
      {/* Name */}
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Name"
          onChange={(e) => setname(e.target.value)}
        ></Input>
      </FormControl>
      {/* Email */}
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Email"
          type="email"
          onChange={(e) => setemail(e.target.value)}
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
          ></Input>
          <InputRightElement onClick={handleClick} cursor={"pointer"}>
            {show ? <ViewOffIcon /> : <ViewIcon />}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {/* Confirm Password */}
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>

        <Input
          placeholder="Confirm Password"
          onChange={(e) => setconfirmpassword(e.target.value)}
          type="password"
        ></Input>
      </FormControl>
      {/* Upload Profile Pic */}
      <FormControl>
        <FormLabel>Upload Profile Pic</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1}
          mb={2}
          placeholder="Confirm Password"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input>
      </FormControl>
      <Button
        colorScheme="whatsapp"
        variant="solid"
        size="md"
        width={"100%"}
        onClick={SubmitHandler}
        isLoading = {loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
