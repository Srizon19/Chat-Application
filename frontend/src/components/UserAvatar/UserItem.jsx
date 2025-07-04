// components/UserItem.js

import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

const UserItem = ({ user, handleFunction }) => {
    // console.log("from user item: ", user)
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="gray.100"
      _hover={{ bg: 'gray.200' }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar name={user.name} src={user.photo} mr={2} />
      <Box>
        <Text fontWeight="bold">{user.name}</Text>
        <Text fontSize="sm">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserItem;
