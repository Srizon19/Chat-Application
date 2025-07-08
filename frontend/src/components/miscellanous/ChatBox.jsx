import React from 'react'
import { ChatState } from '../../Contexts/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from '../UserAvatar/SignleChat';


const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} = ChatState();
  return (
    <Box 
      display={{base: selectedChat? "flex" : "none", md: "flex"}}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      ml={3}
      bg={"white"}
      width={{base: "100%", md: "60%"}}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></SingleChat>
      
    </Box>
  )
}

export default ChatBox