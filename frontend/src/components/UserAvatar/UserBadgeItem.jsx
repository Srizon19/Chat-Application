import { Box, Badge, Button } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box display="flex" flexWrap="wrap"  w="100%" mb={2}>
      <Badge
        key={user._id}
        borderRadius="full"
        px={2}
        py={1}
        m={1}
        fontSize="14px"
        variant="solid"
        colorScheme="purple"
        display="flex"
        alignItems="center"
      >
        {user.name}
        <Button
          size="xs"
          ml={2}
          onClick={handleFunction} 
          variant="ghost"
          color="white"
          _hover={{ bg: 'red.400' }}
        >
          ×
        </Button>
      </Badge>
    </Box>
  );
};

export default UserBadgeItem;
