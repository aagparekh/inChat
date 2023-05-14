import { CloseIcon } from '@chakra-ui/icons';
import { Avatar, Badge, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react'

const UserBadge = ({user,HandleClick}) => {
    // console.log(user);
    return (
        <Flex  backgroundColor={"blackAlpha.100"}
        borderRadius={"full"}
        h={"42%"}
        m={1}
        >
        <Avatar
        size={"sm"}
        cursor={"pointer"}
        name={user.name}
        src={user.pic}  
      ></Avatar>
      <Flex
        alignItems="center"
        p={1}
      >
        <Text fontSize={"sm"}>{user.name}</Text>
        {/* <Text color={"blackAlpha.600"}>Message Yourself</Text> */}
        <CloseIcon boxSize={2} mx={3} onClick={HandleClick} cursor={"pointer"}/>
      </Flex>
      </Flex>
      );
}

export default UserBadge
