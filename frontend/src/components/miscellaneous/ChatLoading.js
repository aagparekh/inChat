import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack px={3}>
      <Skeleton height="60px" />
      <Skeleton height="60px" />
      <Skeleton height="60px" />
      <Skeleton height="60px" />
      <Skeleton height="60px" />
      <Skeleton height="60px" />
      <Skeleton height="60px" />
    </Stack>
  );
};

export default ChatLoading;
